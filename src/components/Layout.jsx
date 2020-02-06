import React from 'react';
import { WEBSOCKET_HOST } from '../api';
import Cable from 'actioncable'

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gameSocket: {}
    }
  }

  componentDidMount() {
    this.createGameSocket()
  }

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
  }

  render = () => {
    return (
      <div className="layout">
        <h2 onClick={this.sendGameEvent}>Pacman</h2>
      </div>
    );
  };
}

export default Layout;
