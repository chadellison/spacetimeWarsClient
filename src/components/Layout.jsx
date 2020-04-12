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
import {updatePlayer, findElapsedTime, updateGameState} from '../helpers/gameLogic.js';
import {keyDownEvent, keyUpEventPayload} from '../helpers/sendEventHelpers.js';
import {addPlayer} from '../helpers/playerHelpers.js';
import {handleEventPayload} from '../helpers/receiveEventHelpers.js';
import {handleAudio} from '../helpers/audioHelpers.js';

const DEFAULT_STATE = {
  userId: new Date().getTime(),
  gameSocket: {},
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 3000,
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
  gameBuff: {}
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.syncClocks(REQUEST_COUNT, true)
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

  handleShopButton = () => {
    if (this.state.currentPlayer.id) {
      this.updateState({modal: 'selection'})
    } else {
      this.updateState(addPlayer(this.state.userId, this.state.players));
    };
  };

  handleKeyDown = (event) => {
    const {currentPlayer, modal, players, userId} = this.state;
    const {explode} = currentPlayer;

    if (!explode && !modal) {
      if (!currentPlayer.id) {
        this.updateState(addPlayer(userId, players));
      } else {
        const pressedKey = KEY_MAP[event.keyCode];
        if (!this.state[pressedKey]) {
          keyDownEvent(pressedKey, this.state, this.handleGameEvent, this.updateState);
          this.setState({[pressedKey]: true})
        };
      };
    }
  };

  handleKeyUp = (event) => {
    const {explode, gameEvent} = this.state.currentPlayer;
    if (!explode && gameEvent !== 'waiting') {
      const pressedKey = KEY_MAP[event.keyCode];
      keyUpEventPayload(pressedKey, this.state, this.handleGameEvent, this.updateState)
      this.setState({[pressedKey]: false});
    };
  };

  handleReceivedEvent = (playerData) => {
    const elapsedTime = findElapsedTime(this.state.clockDifference, playerData.updatedAt);
    const gameState = handleEventPayload(this.state, playerData, elapsedTime);

    handleAudio(playerData);
    this.setState(gameState);
    if (elapsedTime > 400) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
      if (this.state.shortestRoundTripTime > 100) {
        this.syncClocks(REQUEST_COUNT, false);
      };
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

  renderModal = () => {
    const {
      page,
      modal,
      userId,
      activeTab,
      currentPlayer
    } = this.state;
    if (modal === 'instructions') {
      return <InformationModal updateState={this.updateState} />
    } else if (modal === 'credits') {
      return <CreditsModal updateState={this.updateState} />
    } else if (modal === 'selection') {
      return (
        <SelectionModal
          updateState={this.updateState}
          handleGameEvent={this.handleGameEvent}
          userId={userId}
          activeTab={activeTab}
          page={page}
          currentPlayer={currentPlayer}
          players={this.state.players}
        />
      );
    }
  }

  render = () => {
    const {
      modal,
      players,
      gameBuff,
      currentPlayer,
      deployedWeapons,
      clockDifference,
    } = this.state;

    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>{modal ? null : 'Space Wars'}</h2>
        <div className='game row'>
          {this.renderModal()}
          <GameButton
            buttonText={currentPlayer.id ? 'shop' : 'start'}
            onClick={this.handleShopButton}
            className={'gameButton'}
          />
          <HeaderButtons updateState={this.updateState} />
          <PlayerData
            currentPlayer={currentPlayer}
            clockDifference={clockDifference}
            updateState={this.updateState}
            players={players}
          />
          <Canvas
            players={players}
            deployedWeapons={deployedWeapons}
            currentPlayer={currentPlayer}
            gameBuff={gameBuff}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
