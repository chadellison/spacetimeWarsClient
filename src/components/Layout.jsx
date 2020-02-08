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
  findCollisionCoordinates,
  createPlayer
} from '../helpers/gameLogic.js';

const DEFAULT_STATE = {
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
    this.fetchPlayers()
    this.createGameSocket();
    window.addEventListener('keydown', this.handleKeyDown);
    this.interval = setInterval(() => this.movePlayers(), ANAIMATION_FRAME_RATE);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchPlayers() {
    fetch(`${API_HOST}/api/v1/players`)
      .then((response) => response.json())
      .then((jsonPlayers) => {
        const allPlayers = jsonPlayers.map((player) => createPlayer(player));
        this.setState({players: allPlayers})
    }).catch((error) => {
      console.log('ERROR', error)
    });
  }

  createGameSocket() {
    let cable = Cable.createConsumer(WEBSOCKET_HOST)
    let gameSocket = cable.subscriptions.create({ channel: 'GameDataChannel' },
    {
      connected: () => {},
      received: (receivedData) => this.handleGameData(receivedData),
      create: function(gameData) {
        this.perform('create', {
          gameData: gameData
        });
      },
    });

    this.setState({gameSocket: gameSocket})
  };

  handleKeyDown = (event) => {
    const keyCode = event.keyCode
    if (this.state.currentPlayerId) {
      let playerLocations = {};
      const currentPlayer = this.state.players.filter((player) => {
        playerLocations[player.id] = player.location
        return player.id === this.state.currentPlayerId
      })[0];

      if (['left', 'up', 'right', 'down'].includes(KEY_MAP[keyCode]) && KEY_MAP[keyCode] !== currentPlayer.direction) {
        this.sendGameEvent({
          id: this.state.currentPlayerId,
          gameEvent: KEY_MAP[keyCode],
          playerLocations: playerLocations
        });
      };
    } else {
      if (KEY_MAP[keyCode] === 'start') {
        const newPlayerId = this.state.players.length + 1
        this.sendGameEvent({
          id: newPlayerId,
          gameEvent: 'start',
        });
        // use websocket id
        this.setState({currentPlayerId: newPlayerId});
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

  handleGameData = response => {
    const updatedPlayers = response.gameData.map((player) => createPlayer(player));
    this.setState({players: updatedPlayers});
  };

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
