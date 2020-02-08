import React from 'react';
import { WEBSOCKET_HOST } from '../api';
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
  handleWrap,
  findCollisionCoordinates
} from '../helpers/gameLogic.js';

const DEFAULT_STATE = {
  gameSocket: {},
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  board: newBoard(),
  player: {
    name: 'playerName: yoyo',
    score: 0,
    direction: '',
    location: {x: -50, y: 35},
    mouthOpenValue: 40,
    mouthPosition: -1,
  }
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.createGameSocket();
    window.addEventListener('keydown', this.handleDirectionShift);
    this.interval = setInterval(() => this.movePlayer(), ANAIMATION_FRAME_RATE);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  createGameSocket() {
    let cable = Cable.createConsumer(WEBSOCKET_HOST)
    let gameSocket = cable.subscriptions.create({ channel: 'GameDataChannel' },
    {
      connected: () => {},
      received: (gameData) => this.handleGameData(gameData),
      create: function(gameEvent) {
        this.perform('create', {
          gameEvent: gameEvent
        });
      }
    });
    this.setState({gameSocket: gameSocket})
  };

  handleDirectionShift = (event) => {
    const keyCode = event.keyCode
    if (['left', 'up', 'right', 'down'].includes(KEY_MAP[keyCode]) && KEY_MAP[keyCode] !== this.state.player.direction) {
      const player = {...this.state.player, direction: KEY_MAP[keyCode]}
      this.sendGameEvent({player: player})
    };
  }

  movePlayer = () => {
    let player = {...this.state.player}
    handleMouthOpenAngle(player)
    handleDirection(player)
    handleWrap(player, this.state.boardWidth, this.state.boardHeight);
    this.handleCollision(player, this.state.board);
    this.setState({player: player});
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
    this.setState({player: response.gameData.player});
  };

  sendGameEvent = (gameEvent) => {
    this.state.gameSocket.create(gameEvent)
  };

  render = () => {
    const {player, boardHeight, boardWidth, board} = this.state;
    return (
      <div className="layout" onKeyDown={this.handleDirectionShift}>
        <h2>Pacman</h2>
        <div className='game'>
          <Canvas
            player={player}
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
