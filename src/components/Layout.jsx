import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import '../styles/styles.css';
import {KEY_MAP} from '../constants/keyMap.js';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ANAIMATION_FRAME_RATE,
  REQUEST_COUNT
} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  updateGameState,
} from '../helpers/gameLogic.js';
import {
  keyDownEventPayload,
  keyUpEventPayload,
  handleEventPayload
} from '../helpers/eventHelpers.js';
import {handleAudio} from '../helpers/audioHelpers.js';

const DEFAULT_STATE = {
  userId: new Date().getTime(),
  gameSocket: {},
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  currentPlayerId: null,
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 5000,
  deployedWeapons: [],
  waitingPlayer: null,
  gameOver: false
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.syncClocks(REQUEST_COUNT)
    this.createGameSocket();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.interval = setInterval(() => this.renderGame(), ANAIMATION_FRAME_RATE);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  createGameSocket() {
    let cable = Cable.createConsumer(WEBSOCKET_HOST)
    let gameSocket = cable.subscriptions.create({
      channel: 'GameDataChannel',
      userId: this.state.userId
    },
    {
      connected: () => {},
      received: (response) => this.handleReceivedEvent(response.playerData),
      create: function(gameData) {
        this.perform('create', {
          gameData: gameData
        });
      }
    });

    this.setState({gameSocket: gameSocket})
  };

  syncClocks = (iteration) => {
    const sentTime = Date.now();
    fetch(`${API_HOST}/api/v1/time?sent_time=${sentTime}`)
      .then((response) => response.json())
      .then((timeData) => this.handleTimeResponse(sentTime, timeData, iteration))
      .catch((error) => console.log('ERROR', error));
  }

  handleTimeResponse = (sentTime, timeData, iteration) => {
    const responseTime = Date.now();
    const roundTripTime = responseTime - sentTime;
    console.log('round trip time ' + iteration, roundTripTime);
    if (roundTripTime < this.state.shortestRoundTripTime) {
      const clockDifference = timeData.difference - (roundTripTime / 2)
      this.setState({
        clockDifference: clockDifference,
        shortestRoundTripTime: roundTripTime
      });
    }

    if (iteration > 0) {
      iteration -= 1
      this.syncClocks(iteration, roundTripTime)
    } else {
      console.log('clock difference: ***********', this.state.clockDifference);
      console.log('shortest response time: ***********', this.state.shortestRoundTripTime);
      this.fetchPlayers();
    };
  };

  fetchPlayers() {
    fetch(`${API_HOST}/api/v1/game`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => {
          const elapsedTime = findElapsedTime(this.state.clockDifference, player.updatedAt);
          return updatePlayer(player, elapsedTime, this.state.clockDifference)
        });
        this.setState({
          boardWidth: gameData.game.board.width,
          boardHeight: gameData.game.board.height,
          players: players
        });
    }).catch((error) => console.log('ERROR', error));
  };

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create(eventPayload);
  };

  handleKeyDown = (event) => {
    if (this.state.gameOver) {
      this.setState({gameOver: false});
    } else {
      const eventPayload = keyDownEventPayload(event.keyCode, this.state);
      if (eventPayload) {
        this.handleGameEvent(eventPayload);
      };

      if (KEY_MAP[event.keyCode] === 'space' && !this.state.currentPlayerId) {
        this.setState({currentPlayerId: this.state.userId});
      };
    };
  };

  handleKeyUp = (event) => {
    const eventPayload = keyUpEventPayload(
      this.state.currentPlayerId,
      this.state.players,
      event.keyCode
    )
    if (eventPayload) {
      this.handleGameEvent(eventPayload)
    }
  };

  handleReceivedEvent = (playerData) => {
    const gameState = handleEventPayload(
      [...this.state.players],
      playerData,
      this.state.clockDifference,
      [...this.state.deployedWeapons],
      this.state.currentPlayerId,
      this.state.waitingPlayer
    );

    handleAudio(playerData);
    this.setState(gameState);
  };

  renderGame = () => {
    let players = [...this.state.players];
    let deployedWeapons = [...this.state.deployedWeapons]

    if (players.length > 0) {
      const gameData = {
        players: players,
        elapsedTime: ANAIMATION_FRAME_RATE,
        clockDifference: this.state.clockDifference,
        width: this.state.boardWidth,
        height: this.state.boardHeight,
        deployedWeapons: deployedWeapons,
        handleGameEvent: this.handleGameEvent
      }
      const updatedGameState = updateGameState(gameData)
      this.setState(updatedGameState);
    }
  };

  render = () => {
    const {players, boardHeight, boardWidth} = this.state;
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>Space Wars</h2>
        {this.state.gameOver ? <div>GAME OVER</div> : null}
        <div className='game'>
          <Canvas
            players={players}
            height={boardHeight}
            width={boardWidth}
            playerId={this.state.currentPlayerId}
            deployedWeapons={this.state.deployedWeapons}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
