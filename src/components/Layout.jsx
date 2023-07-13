import React from 'react';
import { createGameSocket, fetchGameData, fetchScoreData, getClockData } from '../api/gameData';
import { KEY_MAP } from '../constants/keyMap.js';
import { ANAIMATION_FRAME_RATE, REQUEST_COUNT } from '../constants/settings.js';
import { mothershipItems, motherships } from '../constants/ships.js';
import { updateGameState, updatePlayer } from '../helpers/gameLogic.js';
import { findCurrentPlayer, playerCountDown } from '../helpers/playerHelpers';
import { handleEventPayload } from '../helpers/receiveEventHelpers.js';
import { createBombers, keyDownEvent, keyUpEventPayload, startEventPayload } from '../helpers/sendEventHelpers.js';
import '../styles/styles.css';
import Canvas from './Canvas';
import { GameButton } from './GameButton';
import { HeaderButtons } from './HeaderButtons';
import { Modal } from './Modal';
import PlayerData from './PlayerData';
import { WaveData } from './WaveData';

const INITIAL_MODAL = window.innerWidth < 800 ? 'deviceChageNotification' : 'instructions';

const DEFAULT_STATE = {
  userId: Date.now(),
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
  modal: INITIAL_MODAL,
  activeTab: 'Ships',
  upgrades: [0, 0, 0, 0],
  page: 1,
  gameBuff: {},
  gameOverStats: {},
  abilityData: {
    q: { lastUsed: 0, level: 0 },
    w: { lastUsed: 0, level: 0 },
    e: { lastUsed: 0, level: 0 },
  },
  aiShips: [],
  animations: [],
  showInstructions: false,
  scores: [],
  waveData: { wave: 1, count: 5, active: false },
  motherships,
  started: false,
};

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
  };

  componentDidMount() {
    this.syncClocks(REQUEST_COUNT, () => fetchGameData(this.handleGameDataResponse));
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
    const { waveData, players, userId, startingPlayer } = this.state;
    const { wave, count, active } = waveData;
    if (active) {
      if (Math.random() > 0.97) {
        this.handleGameEvent({ gameEvent: 'supplyShip' });
      }
      if (count > 0) {
        this.setState({ waveData: { ...waveData, count: count - 1 } });
      } else {
        const existingPlayer = findCurrentPlayer(userId, players);
        const currentPlayer = existingPlayer || startingPlayer;
        const opponentTeam = currentPlayer.team === 'red' ? 'blue' : 'red';
        const bombers = createBombers(wave, opponentTeam, players);

        if (bombers) {
          this.handleGameEvent({
            gameEvent: 'bombers',
            team: opponentTeam,
            bombers
          });
        }
        this.setState({ waveData: { ...waveData, wave: wave + 1, count: 15 } });
      }
    }
  }

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
    } else {
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
    const received = (response) => this.handleReceivedEvent(response.playerData);
    const gameSocket = createGameSocket(this.state.userId, received);
    this.setState({ players, gameSocket });
  }

  handleLeaderBoard = () => {
    fetchScoreData((scoreData) => this.setState({ scores: scoreData, modal: 'leaderboard' }))
  }

  handleGameEvent = (eventPayload) => {
    this.state.gameSocket.create({
      ...eventPayload,
      serverTime: Date.now() + this.state.clockDifference,
    });
  };

  handleKeyDown = (event) => {
    const { modal, userId, players, startingPlayer } = this.state;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const existingPlayer = findCurrentPlayer(userId, players)
      const currentPlayer = existingPlayer || startingPlayer;
      if (currentPlayer && currentPlayer.active && !this.state[pressedKey]) {
        this.setState({ [pressedKey]: true })
        keyDownEvent(pressedKey, this.state, this.handleGameEvent, this.updateState, currentPlayer);
      }
    }
  };

  handleKeyUp = (event) => {
    const { userId, players, startingPlayer } = this.state;
    const existingPlayer = findCurrentPlayer(userId, players)
    const currentPlayer = existingPlayer || startingPlayer;
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !this.state.modal && this.state[pressedKey]) {
      this.setState({ [pressedKey]: false });
      keyUpEventPayload(pressedKey, this.state, this.handleGameEvent, this.updateState, currentPlayer)
    };
  };

  handleReceivedEvent = (playerData) => {
    const { clockDifference } = this.state;
    const elapsedTime = Date.now() + clockDifference - playerData.serverTime;

    if (elapsedTime > 2000) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime)
    }
    const gameState = handleEventPayload(this.state, playerData, elapsedTime);

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
      motherships: motherships.map((ship) => ({ ...ship, hitpoints: 5000, maxHitpoints: 5000, items: { ...mothershipItems }, effects: {} })),
      userId: this.state.userId,
      clockDifference: this.state.clockDifference,
      shortestRoundTripTime: this.state.shortestRoundTripTime,
    }
    this.updateState(newState);
    this.syncClocks(3, () => fetchGameData(this.handleGameDataResponse));
  }

  renderGame = () => {
    const currentPlayer = findCurrentPlayer(this.state.userId, this.state.players);
    if (this.state.started && currentPlayer) {

      const updatedGameState = updateGameState(
        this.state,
        this.handleGameEvent,
        this.syncClocks,
        currentPlayer
      );
      this.setState(updatedGameState);
    }
  };

  renderHeaderButtons = (activePlayer) => {
    const showShop = activePlayer && !this.state.modal;
    const countDown = playerCountDown(activePlayer, this.state.clockDifference)
    const showStart = !activePlayer.active && countDown <= 0 && !this.state.modal;

    return (
      <>
        {
          showShop &&
          <GameButton
            className={'gameButton'}
            onClick={() => this.updateState({ modal: 'selection' })}
            buttonText={'shop'}
          />
        }

        {
          showStart &&
          <GameButton
            className={'reEnterButton'}
            onClick={() => this.handleGameEvent(startEventPayload(activePlayer))}
            buttonText={'start'}
          />
        }
      </>
    )
  }

  render() {
    const {
      page,
      modal,
      userId,
      scores,
      started,
      aiShips,
      players,
      gameBuff,
      upgrades,
      waveData,
      activeTab,
      animations,
      abilityData,
      motherships,
      gameOverStats,
      startingPlayer,
      deployedWeapons,
      clockDifference,
      showInstructions
    } = this.state;

    const existingPlayer = findCurrentPlayer(userId, players);
    const activePlayer = existingPlayer || startingPlayer;

    return (
      <div className="layout" onKeyDown={this.handleKeyDown}>
        {waveData.count < 16 && waveData.active &&
          <WaveData content={`Wave ${waveData.wave} starts in ${waveData.count} seconds`} />
        }

        <div>
          {modal && <Modal
            page={page}
            modal={modal}
            userId={userId}
            scores={scores}
            players={players}
            upgrades={upgrades}
            activeTab={activeTab}
            showInstructions={showInstructions}
            resetGame={this.resetGame}
            activePlayer={{ ...activePlayer, inPlayers: existingPlayer }}
            gameOverStats={gameOverStats}
            updateState={this.updateState}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
          />}
          {/* {activePlayer && !modal && <GameButton
            className={'gameButton'}
            onClick={() => this.updateState({ modal: 'selection' })}
            buttonText={'shop'}
          />} */}
          {this.renderHeaderButtons(activePlayer)}

          {!modal && <HeaderButtons
            updateState={this.updateState}
            handleLeaderBoard={this.handleLeaderBoard}
          />}
          {activePlayer.name && <PlayerData
            activePlayer={activePlayer}
            clockDifference={clockDifference}
            handleGameEvent={this.handleGameEvent}
            abilityData={abilityData}
            updateState={this.updateState}
          />}
          <Canvas
            userId={userId}
            started={started}
            currentPlayer={existingPlayer}
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
  };
}

export default Layout;

