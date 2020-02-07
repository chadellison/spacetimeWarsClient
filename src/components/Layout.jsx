import React from 'react';
import { WEBSOCKET_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import '../styles/styles.css';

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gameSocket: {},
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
    this.createGameSocket()
    window.addEventListener('keydown', this.movePlayer)
  };

  movePlayer = (event) => {
    const keyValue = event.keyCode
    const left = 37
    const up = 38
    const right = 39
    const down = 40

    if ([left, up, right, down].includes(keyValue)) {
      let player = {...this.state.player}
      if (player.mouthOpenValue <= 0) {
        player.mouthPosition = 1;
      } else if (player.mouthOpenValue >= 40) {
        player.mouthPosition = -1;
      }

      player.mouthOpenValue += (8 * player.mouthPosition);

      if (keyValue === left) {
        player.direction = 'left';
        player.location.x -= 7;
      }
      if (keyValue === right) {
        player.direction = 'right';
        player.location.x += 7;
      }
      if (keyValue === up) {
        player.direction = 'up';
        player.location.y -= 7;
      }
      if (keyValue === down) {
        player.direction = 'down';
        player.location.y += 7;
      }

      this.setState({player: player});
    }
  };

  handleGameData = response => {
    console.log(response, 'gameData response ...********')
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

  sendGameEvent = (e) => {
    this.state.gameSocket.create('here is a game event from the client!')
  };

  render = () => {
    return (
      <div className="layout" onKeyDown={this.onKeyPressed}>
        <h2 onClick={this.sendGameEvent}>Pacman</h2>
        <div className='game'>
          <Canvas player={this.state.player} />
        </div>
      </div>
    );
  };
}

export default Layout;
