import React from 'react';
import { createGameSocket, fetchGameData, fetchScoreData, getClockData } from '../api/gameData';
import { KEY_MAP } from '../constants/keyMap.js';
import { ANAIMATION_FRAME_RATE, REQUEST_COUNT } from '../constants/settings.js';
import { mothershipItems, motherships } from '../constants/ships.js';
import { updateGameState, updatePlayer } from '../helpers/gameLogic.js';
import { handleEventPayload } from '../helpers/receiveEventHelpers.js';
import { createBombers, keyDownEvent, keyUpEventPayload } from '../helpers/sendEventHelpers.js';
import '../styles/styles.css';
import Canvas from './Canvas';
import { GameButton } from './GameButton';
import { HeaderButtons } from './HeaderButtons';
import { Modal } from './Modal';
import PlayerData from './PlayerData';
import { WaveData } from './WaveData';

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
  abilityData: {
    q: {lastUsed: 0, level: 0},
    w: {lastUsed: 0, level: 0},
    e: {lastUsed: 0, level: 0},
  },
  aiShips: [],
  animations: [],
  showInstructions: false,
  scores: [],
  waveData: { wave: 1, count: 5, active: false },
  motherships,
  pageIsLoaded: false
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    if (document.readyState === 'complete') {
      this.setState({ pageIsLoaded: true });
    } else {
      window.addEventListener('load', () => this.setState({ pageIsLoaded: true }))
    }
    this.syncClocks(REQUEST_COUNT, () => fetchGameData(this.handleGameDataResponse));
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.interval = setInterval(this.renderGame, ANAIMATION_FRAME_RATE);
    this.waveInterval = setInterval(this.updateWaveData, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.waveInterval);
    if (document.readyState !== 'complete') {
      window.removeEventListener('load', () => this.setState({pageIsLoaded: true}));
    }
  }

  updateWaveData = () => {
    const { waveData, players, index } = this.state;
    const {wave, count, active} = waveData;
    if (active) {
      if (Math.random() > 0.97) {
        this.handleGameEvent({gameEvent: 'supplyShip'});
      }
      if (count > 0) {
        this.setState({waveData: {...waveData, count: count - 1} });
      } else {
        const opponentTeam = players[index].team === 'red' ? 'blue' : 'red';
        const bombers = createBombers(wave, opponentTeam, players);

        if (bombers) {
          this.handleGameEvent({
            gameEvent: 'bombers',
            team: opponentTeam,
            bombers
          });
        }
        this.setState({waveData: {...waveData, wave: wave + 1, count: 15} });
      }
    }
  }

  // createGameSocket() {
  //   let cable = Cable.createConsumer(WEBSOCKET_HOST)
  //   let gameSocket = cable.subscriptions.create({
  //     channel: 'GameDataChannel',
  //     userId: this.state.userId
  //   },
  //   {
  //     connected: () => {},
  //     received: (response) => this.handleReceivedEvent(response.playerData),
  //     create: function(gameData) {
  //       this.perform('create', {
  //         gameData: gameData
  //       });
  //     }
  //   });
  //   this.setState({gameSocket: gameSocket})
  // };

  syncClocks = (iteration, callback) => {
    const sentTime = Date.now();
    getClockData(sentTime, (timeData) => this.handleTimeResponse(sentTime, timeData, iteration, callback))
  }

  handleTimeResponse = (sentTime, timeData, iteration, callback) => {
    const responseTime = Date.now();
    const roundTripTime = responseTime - sentTime;
    this.handleClockUpdate(roundTripTime, timeData.difference);

    if (iteration > 0) {
      iteration -= 1
      this.syncClocks(iteration, callback);
    } else if (callback) {
      callback();
    };
  };

  updateState = (newState) => {
    this.setState(newState);
  }

  handleGameDataResponse = (gameData) => {
    const { clockDifference } = this.state;
    const players = gameData.players.map((player) => {
      const elapsedTime = Date.now() + clockDifference - player.updatedAt
      if (player.active) {
        return updatePlayer(player, elapsedTime, clockDifference)
      } else {
        return player;
      }
    });
    this.setState({ players });
    const received = (response) => this.handleReceivedEvent(response.playerData);
    createGameSocket(this.state.userId, received, this.updateState);
  }

  handleLeaderBoard = (scoreData) => {
    fetchScoreData(this.setState({ scores: scoreData, modal: 'leaderboard' }))
  }

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create({
      ...eventPayload,
      serverTime: Date.now() + this.state.clockDifference,
    });
  };

  findActivePlayer = () => {
    const {index, players, startingPlayer} = this.state
    return index !== null ? players[index] : startingPlayer;
  }

  handleKeyDown = (event) => {
    const {modal, players, index} = this.state;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const currentPlayer = players[index];
      if (currentPlayer && currentPlayer.active && !this.state[pressedKey]) {
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
    const { clockDifference } = this.state;
    const elapsedTime = Date.now() + clockDifference - playerData.serverTime;

    if (elapsedTime > 2000) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime)
    }
    const gameState = handleEventPayload(this.state, playerData, elapsedTime) || {};

    if (gameState) {
      this.setState(gameState);
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
      motherships: motherships.map((ship) => ({...ship, hitpoints: 5000, maxHitpoints: 5000, items: {...mothershipItems}, effects: {}})),
      userId: this.state.userId,
      clockDifference: this.state.clockDifference,
      shortestRoundTripTime: this.state.shortestRoundTripTime,
      pageIsLoaded: true
    }
    this.updateState(newState);
    this.syncClocks(3, () => fetchGameData(this.handleGameDataResponse));
  }

  renderGame = () => {
    const updatedGameState = updateGameState(
      this.state,
      this.updateState,
      this.handleGameEvent,
      this.syncClocks
    );
    this.setState(updatedGameState);
  };

  render() {
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
      animations,
      abilityData,
      motherships,
      pageIsLoaded,
      gameOverStats,
      deployedWeapons,
      clockDifference,
      showInstructions
    } = this.state;

    const activePlayer = this.findActivePlayer();
    if (pageIsLoaded) {
      return (
        <div className="layout" onKeyDown={this.handleKeyDown}>
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
              showInstructions={showInstructions}
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
              motherships={motherships}
              deployedWeapons={deployedWeapons}
            />
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>
    }
  };
}

export default Layout;

