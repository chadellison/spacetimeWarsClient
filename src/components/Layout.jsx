import React from 'react';
import { WEBSOCKET_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import '../styles/styles.css';
import {KEY_MAP} from '../constants/keyMap.js';
import {VELOCITY, BOARD_WIDTH, BOARD_HEIGHT} from '../constants/settings.js';

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gameSocket: {},
      boardWidth: BOARD_WIDTH,
      boardHeight: BOARD_HEIGHT,
      player: {
        name: 'playerName: yoyo',
        score: 0,
        direction: '',
        location: {x: 50, y: 50},
        mouthOpenValue: 40,
        mouthPosition: -1,
      }
    }
  };

  componentDidMount() {
    this.createGameSocket();
    window.addEventListener('keydown', this.handleDirectionShift);
    this.interval = setInterval(() => this.movePlayer(), 25);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleDirectionShift = (event) => {
    const keyCode = event.keyCode
    if (['left', 'up', 'right', 'down'].includes(KEY_MAP[keyCode]) && KEY_MAP[keyCode] !== this.state.player.direction) {
      const player = {...this.state.player, direction: KEY_MAP[keyCode]}
      this.sendGameEvent({player: player})
    }
  }

  movePlayer = () => {
    let player = {...this.state.player}
    this.handleMouthOpenAngle(player)
    this.handleDirection(player)
    this.handleWrap(player);
    this.setState({player: player});
  };

  handleDirection = (player) => {
    if (player.direction === 'left') {
      player.location.x -= VELOCITY;
    }
    if (player.direction === 'right') {
      player.location.x += VELOCITY;
    }
    if (player.direction === 'up') {
      player.location.y -= VELOCITY;
    }
    if (player.direction === 'down') {
      player.location.y += VELOCITY;
    }
  }

  handleMouthOpenAngle = (player) => {
    if (player.mouthOpenValue <= 0) {
      player.mouthPosition = 1;
    } else if (player.mouthOpenValue >= 40) {
      player.mouthPosition = -1;
    }

    player.mouthOpenValue += (8 * player.mouthPosition);
  }

  handleWrap = (player) => {
    if (player.location.x >= this.state.boardWidth) {
      player.location.x = 1;
    }

    if (player.location.x <= 0) {
      player.location.x = this.state.boardWidth;
    }

    if (player.location.y >= this.state.boardHeight) {
      player.location.y = 1;
    }

    if (player.location.y <= 0) {
      player.location.y = this.state.boardHeight;
    }
  }

  handleGameData = response => {
    this.setState({player: response.gameData.player});
  };

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

  sendGameEvent = (gameEvent) => {
    this.state.gameSocket.create(gameEvent)
  };

  render = () => {
    return (
      <div className="layout" onKeyDown={this.handleDirectionShift}>
        <h2>Pacman</h2>
        <div className='game'>
          <Canvas
            player={this.state.player}
            height={this.state.boardHeight}
            width={this.state.boardWidth}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
