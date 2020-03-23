import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import PlayerData from './PlayerData';
import SelectionModal from './SelectionModal';
import {InformationModal} from './InformationModal';
import {CreditsModal} from './CreditsModal';
import {GameButton} from './GameButton';
import {HeaderButtons} from './HeaderButtons';
import '../styles/styles.css';
import {ANAIMATION_FRAME_RATE, REQUEST_COUNT} from '../constants/settings.js';
import {KEY_MAP} from '../constants/keyMap.js';
import {
  updatePlayer,
  findElapsedTime,
  updateGameState
} from '../helpers/gameLogic.js';
import {
  keyDownEvent,
  keyUpEventPayload
} from '../helpers/sendEventHelpers.js';

import {handleEventPayload} from '../helpers/receiveEventHelpers.js';
import {handleAudio} from '../helpers/audioHelpers.js';

const DEFAULT_STATE = {
  userId: new Date().getTime(),
  gameSocket: {},
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 5000,
  deployedWeapons: [],
  currentPlayer: {},
  lastFired: 0,
  up: false,
  left: false,
  right: false,
  space: false,
  modal: null,
  activeTab: 'Ships',
  page: 1,
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
    fetch(`${API_HOST}/api/v1/players`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => {
          const elapsedTime = findElapsedTime(this.state.clockDifference, player.updatedAt);
          return updatePlayer(player, elapsedTime, this.state.clockDifference)
        });
        this.setState({players: players});
    }).catch((error) => console.log('ERROR', error));
  };

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create(eventPayload);
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  addPlayer = () => {
    return {
      modal: true,
      currentPlayer: {
        id: this.state.userId,
        gold: 1000,
        gameEvent: 'waiting',
        score: 0,
        items: {},
        fire: false
      }
    };
  }

  updatePlayerState = (updatedPlayer) => {
    const updatedPlayers = [...this.state.players].map((player) => {
      if (player.id === updatedPlayer.id) {
        player = updatedPlayer;
      }
      return player;
    });

    this.updateState({currentPlayer: updatedPlayer, players: updatedPlayers});
  }

  handleShopButton = () => {
    if (this.state.currentPlayer.id) {
      this.updateState({modal: true})
    } else {
      this.updateState(this.addPlayer());
    };
  };

  handleKeyDown = (event) => {
    const {currentPlayer, lastFired, modal, shortestRoundTripTime} = this.state;
    const {explode} = currentPlayer;

    if (!explode && !modal) {
      if (!currentPlayer.id) {
        this.updateState(this.addPlayer());
      } else {
        const pressedKey = KEY_MAP[event.keyCode];
        if (!this.state[pressedKey]) {
          keyDownEvent(pressedKey, lastFired, currentPlayer, this.handleGameEvent, this.updateState, this.updatePlayerState, shortestRoundTripTime);
          this.setState({[pressedKey]: true})
        };
      };
    }
  };

  handleKeyUp = (event) => {
    const {currentPlayer, shortestRoundTripTime} = this.state;
    const {explode, gameEvent} = currentPlayer;
    if (!explode && gameEvent !== 'waiting') {
      const pressedKey = KEY_MAP[event.keyCode];
      keyUpEventPayload(currentPlayer, pressedKey, this.handleGameEvent, this.updateState, this.updatePlayerState, shortestRoundTripTime)
      this.setState({[pressedKey]: false});
    };
  };

  handleReceivedEvent = (playerData) => {
    const {players, clockDifference, deployedWeapons, currentPlayer} = this.state;
    const gameState = handleEventPayload(
      players,
      playerData,
      clockDifference,
      deployedWeapons,
      currentPlayer
    );

    handleAudio(playerData);
    this.setState(gameState);
  };

  renderGame = () => {
    let players = [...this.state.players];
    let deployedWeapons = [...this.state.deployedWeapons]
    let currentPlayer = {...this.state.currentPlayer}
    if (players.length > 0) {
      const gameData = {
        players: players,
        elapsedTime: ANAIMATION_FRAME_RATE,
        clockDifference: this.state.clockDifference,
        deployedWeapons: deployedWeapons,
        handleGameEvent: this.handleGameEvent,
        lastFired: this.state.lastFired,
        updateState: this.updateState,
        currentPlayer: currentPlayer
      }
      const updatedGameState = updateGameState(gameData)
      this.setState(updatedGameState);
    }
  };

  renderModal = () => {
    const {
      page,
      userId,
      activeTab,
      currentPlayer,
      modal
    } = this.state;
    if (modal === 'instructions') {
      return <InformationModal updateState={this.updateState} />
    } else if (modal === 'credits') {
      return <CreditsModal updateState={this.updateState} />
    } else {
      return (
        <SelectionModal
          modal={modal}
          updateState={this.updateState}
          handleGameEvent={this.handleGameEvent}
          userId={userId}
          activeTab={activeTab}
          page={page}
          currentPlayer={currentPlayer}
          updatePlayerState={this.updatePlayerState}
        />
      );
    }
  }

  render = () => {
    const {
      players,
      currentPlayer,
      deployedWeapons,
      clockDifference,
      modal
    } = this.state;
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>{modal ? null : 'Space Wars'}</h2>
        <div className='game row'>
          {this.renderModal()}
          <GameButton
            buttonText={currentPlayer.id ? 'shop' : 'start'}
            handleShopButton={this.handleShopButton}
          />
          <HeaderButtons updateState={this.updateState} />
          <PlayerData
            currentPlayer={currentPlayer}
            clockDifference={clockDifference}
            updateState={this.updateState}
          />
          <Canvas
            players={players}
            deployedWeapons={deployedWeapons}
            currentPlayer={currentPlayer}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
