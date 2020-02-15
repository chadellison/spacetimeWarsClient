import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import '../styles/styles.css';
import {KEY_MAP} from '../constants/keyMap.js';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ANAIMATION_FRAME_RATE
} from '../constants/settings.js';
import {
  handleWall,
  updatePlayer
} from '../helpers/gameLogic.js';

import {animatePlayer} from '../helpers/canvasHelper.js'

const DEFAULT_STATE = {
  userId: new Date().getTime(),
  gameSocket: {},
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  currentPlayerId: null,
  players: [],
  clockDifference: 0,
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.fetchTime();
    this.createGameSocket();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.interval = setInterval(() => this.movePlayers(), ANAIMATION_FRAME_RATE);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchTime() {
    const sentTime = Date.now();
    const startTime = new Date('2020-01-01 06:00:00 UTC').getTime();
    fetch(`${API_HOST}/api/v1/time?sent_time=${sentTime}&start_time=${startTime}`)
      .then((response) => response.json())
      .then((timeData) => {
        console.log('clock difference: ***********', timeData.difference)
        this.fetchPlayers();
        this.setState({clockDifference: timeData.difference})
    }).catch((error) => console.log('ERROR', error));
  }

  fetchPlayers() {
    fetch(`${API_HOST}/api/v1/game`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => updatePlayer(player, this.state.clockDifference));
        this.setState({
          boardWidth: gameData.game.board.width,
          boardHeight: gameData.game.board.height,
          board: gameData.game.board.squares,
          players: players
        });
    }).catch((error) => console.log('ERROR', error));
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

  handleKeyDown = (event) => {
    const keyCode = event.keyCode
    const currentPlayer = this.state.players.filter((player) => {
      return player.id === this.state.currentPlayerId
    })[0];

    if (this.state.currentPlayerId) {
      if (['left', 'up', 'right', 'down'].includes(KEY_MAP[keyCode]) && KEY_MAP[keyCode] !== currentPlayer.direction) {
        this.sendGameEvent({
          id: this.state.currentPlayerId,
          gameEvent: KEY_MAP[keyCode],
          location: currentPlayer.location,
          angle: currentPlayer.angle
        });
        this.setState({currentPlayerId: this.state.userId});
      };
    } else {
      if (KEY_MAP[keyCode] === 'start') {
        this.sendGameEvent({
          id: this.state.userId,
          gameEvent: 'start',
        });
        this.setState({currentPlayerId: this.state.userId});
      }
    }
  }

  handleKeyUp = (event) => {
    const keyCode = event.keyCode
    let userEvent;

    const currentPlayer = this.state.players.filter((player) => {
      return player.id === this.state.currentPlayerId
    })[0];

    if ('right' === KEY_MAP[keyCode]) {
      this.sendGameEvent({
        id: this.state.userId,
        gameEvent: 'rightStop',
        location: currentPlayer.location,
        angle: currentPlayer.angle
      });
    }
    if ('left' === KEY_MAP[keyCode]) {
      this.sendGameEvent({
        id: this.state.userId,
        gameEvent: 'leftStop',
        location: currentPlayer.location,
        angle: currentPlayer.angle
      });
    }
  }

  handleReceivedEvent(playerData) {
    let players = [...this.state.players];
    if (playerData.lastEvent === 'start') {
      players = [...players, playerData]
    }

    if (playerData.lastEvent === 'remove') {
      players = players.filter((player) => player.id !== playerData.id)
    }

    const updatedPlayers = players.map((player) => {
      if (player.id === playerData.id) {
        return updatePlayer(playerData, this.state.clockDifference);
      } else {
        return player;
      };
    });
    this.setState({players: updatedPlayers});
  }

  movePlayers = () => {
    let players = [...this.state.players];
    if (players.length > 0) {
      players.forEach((player) => {
        // handleDirection(player)
        animatePlayer(player)
        handleWall(player, this.state.boardWidth, this.state.boardHeight);
        // this.handleCollision(player, this.state.board);
      });
      this.setState({players: players});
    }
  };

  // handleCollision = (player, board) => {
  //   const coordinates = findCollisionCoordinates(player);
  //   const key = coordinates[0] + ':' + coordinates[1];
  //   if (board[key] === 1) {
  //     player.score += 1;
  //     this.setState({board: {...board, [key]: 0 }});
  //   };
  // }

  sendGameEvent = (gameData) => {
    this.state.gameSocket.create(gameData)
  };

  render = () => {
    const {players, boardHeight, boardWidth, board} = this.state;
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>Tanks</h2>
        <div className='game'>
          <Canvas
            players={players}
            height={boardHeight}
            width={boardWidth}
            board={board}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
