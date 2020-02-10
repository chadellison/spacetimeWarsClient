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
import {newBoard} from '../helpers/canvasHelper.js'
import {
  handleDirection,
  handleMouthOpenAngle,
  handleWall,
  findCollisionCoordinates
} from '../helpers/gameLogic.js';

const DEFAULT_STATE = {
  userId: new Date().getTime(),
  gameSocket: {},
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  board: newBoard(),
  currentPlayerId: null,
  players: []
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.fetchPlayers();
    this.createGameSocket();
    window.addEventListener('keydown', this.handleKeyDown);
    this.interval = setInterval(() => this.movePlayers(), ANAIMATION_FRAME_RATE);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchPlayers() {
    fetch(`${API_HOST}/api/v1/game`)
      .then((response) => response.json())
      .then((gameData) => {
        this.setState({
          boardWidth: gameData.game.board.width,
          boardHeight: gameData.game.board.height,
          board: gameData.game.board.squares,
          players: gameData.players
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
      received: (response) => this.setState({players: response.playerData}),
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
    let playerLocations = {};
    const currentPlayer = this.state.players.filter((player) => {
      playerLocations[player.id] = player.location
      return player.id === this.state.currentPlayerId
    })[0];

    if (this.state.currentPlayerId) {
      if (['left', 'up', 'right', 'down'].includes(KEY_MAP[keyCode]) && KEY_MAP[keyCode] !== currentPlayer.direction) {
        this.sendGameEvent({
          id: this.state.currentPlayerId,
          gameEvent: KEY_MAP[keyCode],
          playerLocations: playerLocations,
          sentTime: new Date().getTime()
        });
      };
    } else {
      if (KEY_MAP[keyCode] === 'start') {
        this.sendGameEvent({
          id: this.state.userId,
          gameEvent: 'start',
          playerLocations: playerLocations,
          sentTime: new Date().getTime()
        });
        this.setState({currentPlayerId: this.state.userId});
      }
    }
  }

  movePlayers = () => {
    let players = [...this.state.players];
    if (players.length > 0) {
      players.forEach((player) => {
        handleMouthOpenAngle(player)
        handleDirection(player)
        handleWall(player, this.state.boardWidth, this.state.boardHeight);
        this.handleCollision(player, this.state.board);
      });
      this.setState({players: players});
    }
  };

  handleCollision = (player, board) => {
    const coordinates = findCollisionCoordinates(player);
    const key = coordinates[0] + ':' + coordinates[1];
    if (board[key] === 1) {
      player.score += 1;
      this.setState({board: {...board, [key]: 0 }});
    };
  }

  sendGameEvent = (gameData) => {
    this.state.gameSocket.create(gameData)
  };

  render = () => {
    const {players, boardHeight, boardWidth, board} = this.state;
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>Pacman</h2>
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
