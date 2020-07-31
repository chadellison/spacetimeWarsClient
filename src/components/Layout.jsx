import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import PlayerData from './PlayerData';
import {Modal} from './Modal';
import {GameButton} from './GameButton';
import {HeaderButtons} from './HeaderButtons';
import '../styles/styles.css';
import {ANAIMATION_FRAME_RATE, REQUEST_COUNT} from '../constants/settings.js';
import {KEY_MAP} from '../constants/keyMap.js';
import {updatePlayer, updateGameState} from '../helpers/gameLogic.js';
import {keyDownEvent, keyUpEventPayload, handleAiEvents} from '../helpers/sendEventHelpers.js';
import {addPlayer} from '../helpers/playerHelpers.js';
import {handleEventPayload} from '../helpers/receiveEventHelpers.js';

const DEFAULT_STATE = {
  userId: Date.now(),
  index: null,
  startingPlayer: {},
  gameSocket: {},
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: 3000,
  deployedWeapons: [],
  lastFired: 0,
  up: false,
  left: false,
  right: false,
  space: false,
  modal: null,
  activeTab: 'Ships',
  upgrades: [0, 0, 0, 0],
  page: 1,
  gameBuff: {},
  gameOverStats: {},
  defenseData: { red: 10, blue: 10 },
  abilityCooldownData: {q: 0, w: 0, e: 0},
  aiShips: [],
  animations: [],
  eventData: {
    lastSend: 0,
    count: 0,
    shipCount: 0,
    shipHitpoints: 100,
    userEvents: {},
    sendInterval: 30
  },
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.syncClocks(REQUEST_COUNT)
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
    this.handleClockUpdate(roundTripTime, timeData.difference);

    if (iteration > 0) {
      iteration -= 1
      this.syncClocks(iteration)
    } else {
      this.fetchPlayers();
    };
  };

  fetchPlayers() {
    const {clockDifference} = this.state;
    fetch(`${API_HOST}/api/v1/players`)
      .then((response) => response.json())
      .then((gameData) => {
        const players = gameData.players.map((player) => {
          const elapsedTime = Date.now() + clockDifference - player.updatedAt
          if (player.active) {
            return updatePlayer(player, elapsedTime, clockDifference)
          } else {
            return player;
          }
        });
        const aiShips = gameData.aiShips.map((ship) => {
          const elapsedTime = Date.now() + clockDifference - ship.updatedAt
          return updatePlayer(ship, elapsedTime, clockDifference);
        });
        this.setState({players, aiShips, defenseData: gameData.defenseData});
        this.createGameSocket()
    }).catch((error) => console.log('ERROR', error));
  };

  handleGameEvent = (eventPayload) => {
    let userEvents = {...this.state.eventData.userEvents};
    const id = Object.keys(userEvents).length
    const sentTime = Date.now();
    this.state.gameSocket.create({
      ...eventPayload,
      eventId: id,
      serverTime: sentTime + this.state.clockDifference
    });
    userEvents[id] = sentTime;
    let eventData = {...this.state.eventData}
    eventData.userEvents = userEvents
    this.setState({eventData})
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  handleShopButton = () => {
    const {players, startingPlayer, userId} = this.state;

    if (startingPlayer.name) {
      this.updateState({modal: 'selection'})
    } else {
      this.updateState(addPlayer(userId, players));
    };
  };

  findActivePlayer = () => {
    const {index, players, startingPlayer} = this.state
    return index !== null ? players[index] : startingPlayer;
  }

  handleKeyDown = (event) => {
    const {modal, players, index, startingPlayer} = this.state;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      if (!startingPlayer.name) {
        this.updateState(addPlayer(this.state.userId, players));
      } else {
        const currentPlayer = players[index]
        if (currentPlayer && currentPlayer.active && !this.state[pressedKey]) {
          this.setState({[pressedKey]: true})
          keyDownEvent(pressedKey, this.state, this.handleGameEvent, this.updateState);
        }
      };
    }
  };

  handleKeyUp = (event) => {
    const currentPlayer = this.state.players[this.state.index]
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !this.state.modal && this.state[pressedKey]) {
      this.setState({[pressedKey]: false});
      keyUpEventPayload(pressedKey, this.state, this.handleGameEvent, this.updateState)
    };
  };

  handleReceivedEvent = (playerData) => {
    const {clockDifference} = this.state;
    this.handleEventData(playerData);
    const elapsedTime = Date.now() + clockDifference - playerData.serverTime;
    const gameState = handleEventPayload(this.state, playerData, elapsedTime);
    this.setState(gameState);

    if (elapsedTime > 400) {
      // maybe throw away events
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
    };
  };

  handleEventData = (playerData) => {
    if (playerData.index === this.state.index) {
      let userEvents = {...this.state.eventData.userEvents}
      const sentTime = userEvents[playerData.eventId]
      this.handleClockUpdate(Date.now() - sentTime, playerData.updatedAt - sentTime);
      delete userEvents[playerData.eventId]
      const eventData = handleAiEvents(this.state.eventData, playerData.team, this.handleGameEvent);
      this.setState({eventData: {...eventData, userEvents: userEvents}})
    }
  }

  handleClockUpdate = (roundTripTime, difference) => {
    if (roundTripTime < this.state.shortestRoundTripTime) {
      const clockDifference = difference - (roundTripTime / 2)
      console.log('shorter time', roundTripTime)
      console.log('new clock difference', clockDifference)
      this.setState({
        clockDifference: clockDifference,
        shortestRoundTripTime: roundTripTime
      });
    };
  };

  resetGame = () => {
    const newState = {
      ...DEFAULT_STATE,
      userId: this.state.userId,
      clockDifference: this.state.clockDifference,
      shortestRoundTripTime: this.state.shortestRoundTripTime
    }
    this.updateState(newState);
    this.syncClocks(3)
  }

  renderGame = () => {
    const updatedGameState = updateGameState(
      this.state,
      this.updateState,
      this.handleGameEvent
    );
    this.setState(updatedGameState);
  };

  render = () => {
    const {
      page,
      modal,
      index,
      aiShips,
      players,
      gameBuff,
      upgrades,
      activeTab,
      animations,
      defenseData,
      gameOverStats,
      deployedWeapons,
      clockDifference,
      abilityCooldownData,
    } = this.state;

    const activePlayer = this.findActivePlayer();

    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        <h2>{modal ? null : 'Space Wars'}</h2>
        <div className='game row'>
          {modal && <Modal
            page={page}
            modal={modal}
            index={index}
            players={players}
            upgrades={upgrades}
            activeTab={activeTab}
            defenseData={defenseData}
            resetGame={this.resetGame}
            activePlayer={activePlayer}
            gameOverStats={gameOverStats}
            updateState={this.updateState}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
          />}
          {activePlayer && <GameButton
            className={'gameButton'}
            onClick={this.handleShopButton}
            buttonText={activePlayer.name ? 'shop' : 'start'}
          />}
          <HeaderButtons updateState={this.updateState} />
          {activePlayer.name && <PlayerData
            modal={modal}
            defenseData={defenseData}
            activePlayer={activePlayer}
            updateState={this.updateState}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
            abilityCooldownData={abilityCooldownData}
          />}
          <Canvas
            index={index}
            players={players}
            aiShips={aiShips}
            gameBuff={gameBuff}
            animations={animations}
            deployedWeapons={deployedWeapons}
          />
        </div>
      </div>
    );
  };
}

export default Layout;
