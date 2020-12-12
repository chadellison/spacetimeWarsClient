import React from 'react';
import { WEBSOCKET_HOST, API_HOST } from '../api';
import Cable from 'actioncable';
import Canvas from './Canvas';
import PlayerData from './PlayerData';
import {Modal} from './Modal';
import {GameButton} from './GameButton';
import {HeaderButtons} from './HeaderButtons';
import {Banner} from './Banner';
import {WaveData} from './WaveData';
import '../styles/styles.css';
import {ANAIMATION_FRAME_RATE, REQUEST_COUNT} from '../constants/settings.js';
import {KEY_MAP} from '../constants/keyMap.js';
import {updatePlayer, updateGameState} from '../helpers/gameLogic.js';
import {keyDownEvent, keyUpEventPayload, createBombers} from '../helpers/sendEventHelpers.js';
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
  modal: 'instructions',
  activeTab: 'Ships',
  upgrades: [0, 0, 0, 0],
  page: 1,
  gameBuff: {},
  gameOverStats: {},
  defenseData: { red: 10, blue: 10 },
  abilityData: {
    q: {lastUsed: 0, level: 0},
    w: {lastUsed: 0, level: 0},
    e: {lastUsed: 0, level: 0},
  },
  aiShips: [],
  animations: [],
  howToPlay: false,
  eventData: {
    count: 0,
    slowResponseCount: 0,
  },
  slowConnectionBanner: false,
  scores: [],
  waveData: {wave: 1, count: 15, active: false}
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
    this.interval = setInterval(this.renderGame, ANAIMATION_FRAME_RATE);
    this.waveInterval = setInterval(this.updateWaveData, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.waveInterval);
  }

  updateWaveData = () => {
    const {waveData, players, index} = this.state;
    const {wave, count, active} = waveData;
    if (active) {
      if (Math.random() > 0.98) {
        this.handleGameEvent({gameEvent: 'supplyShip'});
      }
      if (count > 0) {
        this.setState({waveData: {...waveData, count: count - 1} });
      } else {
        const opponentTeam = players[index].team === 'red' ? 'blue' : 'red';
        this.handleGameEvent({
          gameEvent: 'bombers',
          team: opponentTeam,
          bombers: createBombers(wave, opponentTeam)
        });
        this.setState({waveData: {...waveData, wave: wave + 1, count: 30} });
      }
    }
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
        this.setState({players, defenseData: gameData.defenseData});
        this.createGameSocket()
    }).catch((error) => console.log('ERROR', error));
  };

  handleLeaderBoard = () => {
    fetch(`${API_HOST}/api/v1/scores`)
      .then((response) => response.json())
      .then((scoreData) => {
        this.setState({ scores: scoreData, modal: 'leaderboard' });
    }).catch((error) => console.log('ERROR', error));
  }

  handleGameEvent = (eventPayload) => {
    let eventData = {...this.state.eventData}
    eventData.count += 1;
    const sentTime = Date.now();
    this.state.gameSocket.create({
      ...eventPayload,
      eventId: eventData.count,
      serverTime: sentTime + this.state.clockDifference
    });
    this.setState({eventData})
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  findActivePlayer = () => {
    const {index, players, startingPlayer} = this.state
    return index !== null ? players[index] : startingPlayer;
  }

  handleKeyDown = (event) => {
    const {modal, players, index} = this.state;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const currentPlayer = players[index];
      if (currentPlayer.active && !this.state[pressedKey]) {
        this.setState({[pressedKey]: true})
        keyDownEvent(pressedKey, this.state, this.handleGameEvent, this.updateState);
      }
    }
  };

  handleKeyUp = (event) => {
    const {players, index} = this.state;
    const currentPlayer = players[index]
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !this.state.modal && this.state[pressedKey]) {
      this.setState({[pressedKey]: false});
      keyUpEventPayload(pressedKey, this.state, this.handleGameEvent, this.updateState)
    };
  };

  handleReceivedEvent = (playerData) => {
    const {clockDifference, eventData} = this.state;
    const elapsedTime = Date.now() + clockDifference - playerData.serverTime;
    if (elapsedTime > 2000) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
      if (eventData.slowResponseCount > 50) {
        this.setState({ eventData: {...eventData, slowResponseCount: 0 }, slowConnectionBanner: true})
      } else {
        this.setState({ eventData: {...eventData, slowResponseCount: eventData.slowResponseCount + 1 }})
      }
    } else {
      const gameState = handleEventPayload(this.state, playerData, elapsedTime);
      if (gameState) {
        this.setState(gameState)
      };
    }
  };

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
      userId,
      scores,
      aiShips,
      players,
      gameBuff,
      upgrades,
      waveData,
      activeTab,
      howToPlay,
      animations,
      defenseData,
      abilityData,
      gameOverStats,
      deployedWeapons,
      clockDifference,
      slowConnectionBanner,
    } = this.state;

    const activePlayer = this.findActivePlayer();

    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        {slowConnectionBanner &&
          <Banner
            updateState={this.updateState}
            content={'Slow response times detected. Please check your internet connection.'}
          />
        }
        {waveData.count < 16 && waveData.active &&
          <WaveData content={`Wave ${waveData.wave} starts in ${waveData.count} seconds`}/>
        }
        <div className='game row'>
          {modal && <Modal
            page={page}
            modal={modal}
            index={index}
            userId={userId}
            scores={scores}
            players={players}
            upgrades={upgrades}
            activeTab={activeTab}
            howToPlay={howToPlay}
            defenseData={defenseData}
            resetGame={this.resetGame}
            activePlayer={activePlayer}
            gameOverStats={gameOverStats}
            updateState={this.updateState}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
          />}
          {activePlayer && !modal && <GameButton
            className={'gameButton'}
            onClick={() => this.updateState({modal: 'selection'})}
            buttonText={'shop'}
          />}
          {!modal && <HeaderButtons
            updateState={this.updateState}
            handleLeaderBoard={this.handleLeaderBoard}
          />}
          {activePlayer.name && <PlayerData
            modal={modal}
            defenseData={defenseData}
            activePlayer={activePlayer}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
            abilityData={abilityData}
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
