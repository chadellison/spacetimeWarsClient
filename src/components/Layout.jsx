import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import PlayerData from './PlayerData';
import {Modal} from './Modal';
import {GameButton} from './GameButton';
import {HeaderButtons} from './HeaderButtons';
import '../styles/styles.css';
import {ANAIMATION_FRAME_RATE, REQUEST_COUNT} from '../constants/settings.js';
import {KEY_MAP} from '../constants/keyMap.js';
import {updatePlayer, findElapsedTime, updateGameState} from '../helpers/gameLogic.js';
import {keyDownEvent, keyUpEventPayload} from '../helpers/sendEventHelpers.js';
import {addPlayer} from '../helpers/playerHelpers.js';
import {handleEventPayload} from '../helpers/receiveEventHelpers.js';

const DEFAULT_STATE = {
  userId: Date.now(),
  index: null,
  startingPlayer: {},
  gameSocket: {},
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 3000,
  deployedWeapons: [],
  lastFired: 0,
  up: false,
  left: false,
  right: false,
  space: false,
  modal: null,
  activeTab: 'Ships',
  page: 1,
  gameBuff: {},
  gameOverStats: {},
  defenseData: { red: 10, blue: 10 },
  abilityUsedAt: 0,
  aiShips: [],
  animations: [],
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.createGameSocket()
    this.syncClocks(REQUEST_COUNT, true)
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

  syncClocks = (iteration, shouldFetchPlayers) => {
    const sentTime = Date.now();
    fetch(`${API_HOST}/api/v1/time?sent_time=${sentTime}`)
      .then((response) => response.json())
      .then((timeData) => this.handleTimeResponse(sentTime, timeData, iteration, shouldFetchPlayers))
      .catch((error) => console.log('ERROR', error));
  }

  handleTimeResponse = (sentTime, timeData, iteration, shouldFetchPlayers) => {
    const responseTime = Date.now();
    const roundTripTime = responseTime - sentTime;
    this.handleClockUpdate(roundTripTime, timeData.difference);

    if (iteration > 0) {
      iteration -= 1
      this.syncClocks(iteration, shouldFetchPlayers)
    } else if (shouldFetchPlayers) {
      console.log('clock difference: ***********', this.state.clockDifference);
      this.fetchPlayers();
    };
    console.log('shortest response time: ***********', this.state.shortestRoundTripTime);
  };

  fetchPlayers() {
    const {clockDifference} = this.state;
    fetch(`${API_HOST}/api/v1/players`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => {
          const elapsedTime = findElapsedTime(clockDifference, player.updatedAt);
          if (player.active) {
            return updatePlayer(player, elapsedTime, clockDifference)
          } else {
            return player;
          }
        });
        const aiShips = gameData.aiShips.map((ship) => {
          const elapsedTime = findElapsedTime(clockDifference, ship.updatedAt);
          return updatePlayer(ship, elapsedTime, clockDifference);
        });
        this.setState({players, aiShips, defenseData: gameData.defenseData});
    }).catch((error) => console.log('ERROR', error));
  };

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create(eventPayload);
    this.setState({testTime: Date.now()})
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  handleShopButton = () => {
    const currentPlayer = this.state.players[this.state.index]
    if (currentPlayer) {
      this.updateState({modal: 'selection'})
    } else {
      this.updateState(addPlayer(this.state.userId, this.state.players));
    };
  };

  findActivePlayer = () => {
    const {index, players, startingPlayer} = this.state
    return (index || index === 0) ? players[index] : startingPlayer;
  }

  handleKeyDown = (event) => {
    const {modal, players, index, startingPlayer} = this.state;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      if (!startingPlayer.name) {
        this.updateState(addPlayer(this.state.userId, players));
      } else {
        const currentPlayer = players[index]
        if (currentPlayer && currentPlayer.active && !this.state[pressedKey]) {
          this.setState({[pressedKey]: true})
          keyDownEvent(pressedKey, this.state, this.handleGameEvent, this.updateState);
        }
      };
    }
  };

  handleKeyUp = (event) => {
    const currentPlayer = this.state.players[this.state.index]
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !this.state.modal && this.state[pressedKey]) {
      this.setState({[pressedKey]: false});
      keyUpEventPayload(pressedKey, this.state, this.handleGameEvent, this.updateState)
    };
  };

  handleReceivedEvent = (playerData) => {
    // consider adding shortestRoundTripTime / 2 to elapsedTime
    console.log('TEST TIME: ', Date.now() - this.state.testTime)
    const elapsedTime = findElapsedTime(this.state.clockDifference, playerData.updatedAt - (this.state.shortestRoundTripTime / 2));
    const gameState = handleEventPayload(this.state, playerData, elapsedTime);

    this.setState(gameState);
    if (this.state.shortestRoundTripTime > 100) {
      this.syncClocks(2, false);
    };
    if (elapsedTime > 400) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
    };
  };

  handleClockUpdate = (roundTripTime, difference) => {
    if (roundTripTime < this.state.shortestRoundTripTime) {
      const clockDifference = difference - (roundTripTime / 2)
      this.setState({
        clockDifference: clockDifference,
        shortestRoundTripTime: roundTripTime
      });
    };
  };

  renderGame = () => {
    const updatedGameState = updateGameState(
      this.state,
      this.updateState,
      this.handleGameEvent
    );
    this.setState(updatedGameState);
  };

  render = () => {
    const {
      page,
      modal,
      index,
      aiShips,
      players,
      gameBuff,
      activeTab,
      animations,
      defenseData,
      abilityUsedAt,
      gameOverStats,
      deployedWeapons,
      clockDifference,
    } = this.state;

    const activePlayer = this.findActivePlayer();
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>{modal ? null : 'Space Wars'}</h2>
        <div className='game row'>
          {modal && <Modal
            page={page}
            modal={modal}
            index={index}
            players={players}
            activeTab={activeTab}
            defenseData={defenseData}
            activePlayer={activePlayer}
            gameOverStats={gameOverStats}
            updateState={this.updateState}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
          />}
          {activePlayer && <GameButton
            buttonText={activePlayer.name ? 'shop' : 'start'}
            onClick={this.handleShopButton}
            className={'gameButton'}
          />}
          <HeaderButtons updateState={this.updateState} />
          {activePlayer.name && <PlayerData
            clockDifference={clockDifference}
            updateState={this.updateState}
            activePlayer={activePlayer}
            defenseData={defenseData}
            abilityUsedAt={abilityUsedAt}
          />}
          <Canvas
            players={players}
            deployedWeapons={deployedWeapons}
            index={index}
            aiShips={aiShips}
            gameBuff={gameBuff}
            animations={animations}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
