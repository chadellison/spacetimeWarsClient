import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import PlayerData from './PlayerData';
import SelectionModal from './SelectionModal';
import '../styles/styles.css';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ANAIMATION_FRAME_RATE,
  REQUEST_COUNT
} from '../constants/settings.js';
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
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 5000,
  deployedWeapons: [],
  currentPlayer: {},
  gameOver: false,
  isFiring: false,
  lastFired: 0,
  up: false,
  left: false,
  right: false,
  space: false,
  showSelectionModal: false,
  activeTab: 'Ship',
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
    fetch(`${API_HOST}/api/v1/game`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => {
          const elapsedTime = findElapsedTime(this.state.clockDifference, player.updatedAt);
          return updatePlayer(player, elapsedTime, this.state.clockDifference)
        });
        this.setState({
          boardWidth: gameData.game.board.width,
          boardHeight: gameData.game.board.height,
          players: players
        });
    }).catch((error) => console.log('ERROR', error));
  };

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create(eventPayload);
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  handleKeyDown = (event) => {
    const {explode} = this.state.currentPlayer;
    if (!explode && !this.state.showSelectionModal) {
      if (!this.state.currentPlayer.id) {
        this.updateState({
          gameOver: false,
          showSelectionModal: true,
          currentPlayer: {
            id: this.state.userId,
            gold: 1000,
            lastEvent: 'waiting',
            lives: 3,
            score: 0,
            items: []
          }
        });
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
    const {explode, lastEvent} = this.state.currentPlayer;
    if (!explode && lastEvent !== 'waiting') {
      const pressedKey = KEY_MAP[event.keyCode];
      keyUpEventPayload(
        this.state.currentPlayer,
        this.state.players,
        pressedKey,
        this.handleGameEvent,
        this.updateState
      )
      this.setState({[pressedKey]: false});
    };
  };

  handleReceivedEvent = (playerData) => {
    const gameState = handleEventPayload(
      [...this.state.players],
      playerData,
      this.state.clockDifference,
      [...this.state.deployedWeapons],
      this.state.currentPlayer
    );

    handleAudio(playerData);
    this.setState(gameState);
  };

  renderGame = () => {
    let players = [...this.state.players];
    let deployedWeapons = [...this.state.deployedWeapons]

    if (players.length > 0) {
      const gameData = {
        players: players,
        elapsedTime: ANAIMATION_FRAME_RATE,
        clockDifference: this.state.clockDifference,
        width: this.state.boardWidth,
        height: this.state.boardHeight,
        deployedWeapons: deployedWeapons,
        handleGameEvent: this.handleGameEvent,
        lastFired: this.state.lastFired,
        isFiring: this.state.isFiring,
        updateState: this.updateState,
        currentPlayer: this.state.currentPlayer
      }
      const updatedGameState = updateGameState(gameData)
      this.setState(updatedGameState);
    }
  };

  renderPlayerData() {
    const {currentPlayer, clockDifference, showSelectionModal} = this.state;
    return (
      <PlayerData
        currentPlayer={currentPlayer}
        clockDifference={clockDifference}
        updateState={this.updateState}
        showSelectionModal={showSelectionModal}
      />
    );
  }

  renderSelectionModal() {
    if (this.state.showSelectionModal) {
      return (
        <SelectionModal
          showSelectionModal={this.state.showSelectionModal}
          updateState={this.updateState}
          handleGameEvent={this.handleGameEvent}
          userId={this.state.userId}
          activeTab={this.state.activeTab}
          page={this.state.page}
          currentPlayer={this.state.currentPlayer}
        />
      );
    }
  };

  render = () => {
    const {players, boardHeight, boardWidth} = this.state;
    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>{this.state.showSelectionModal ? null : 'Space Wars'}</h2>
        <div className='game row'>
          {this.renderSelectionModal()}
          {this.renderPlayerData()}
          <Canvas
            players={players}
            height={boardHeight}
            width={boardWidth}
            deployedWeapons={this.state.deployedWeapons}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
