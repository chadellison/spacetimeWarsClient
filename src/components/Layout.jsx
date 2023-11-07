import React, { useEffect, useState, useRef } from 'react';
import { createGameSocket, fetchGameData, fetchScoreData, getClockData } from '../api/gameData';
import { KEY_MAP } from '../constants/keyMap.js';
import { ANAIMATION_FRAME_RATE, REQUEST_COUNT, WAVE_UPDATE_INTERVAL, LATENCY_THRESHOLD, WINDOW_WIDTH_THRESHOLD } from '../constants/settings.js';
import { MOTHER_SHIPS } from '../constants/ships.js';
import { updateGameState, updatePlayer } from '../helpers/gameLogic.js';
import { findCurrentPlayer } from '../helpers/playerHelpers';
import { handleEventPayload } from '../helpers/receiveEventHelpers.js';
import { createBombers, keyDownEvent, keyUpEventPayload } from '../helpers/sendEventHelpers.js';
import '../styles/styles.css';
import Canvas from './Canvas';
import Header from './Header';
import { Modal } from './Modal';
import PlayerData from './PlayerData';
import introMusic from '../audio/introJingle.wav'

const INITIAL_MODAL = window.innerWidth < WINDOW_WIDTH_THRESHOLD ? 'deviceChageNotification' : 'instructions';

const DEFAULT_STATE = {
  userId: Date.now(),
  startingPlayer: {},
  gameSocket: {},
  players: [],
  clockDifference: 0,
  shortestRoundTripTime: LATENCY_THRESHOLD,
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
  motherships: MOTHER_SHIPS,
  connected: false,
  gameMode: ''
};

const Layout = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  const stateRef = useRef(state);
  const updateState = (newState) => {
    const updatedState = { ...stateRef.current, ...newState };
    setState(updatedState);
    stateRef.current = updatedState;
  }

  useEffect(() => {
      syncClocks(REQUEST_COUNT, () => fetchGameData(handleGameDataResponse));
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      const interval = setInterval(renderGame, ANAIMATION_FRAME_RATE);
      const waveInterval = setInterval(updateWaveData, WAVE_UPDATE_INTERVAL);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        clearInterval(interval);
        clearInterval(waveInterval);
      }
  }, []);

  const updateWaveData = () => {
    const { waveData, players, userId, gameMode } = stateRef.current;
    const { wave, count } = waveData;
    const currentPlayer = findCurrentPlayer(userId, players);

    if (currentPlayer) {
      if (Math.random() > 0.97) {
        const buffIndex = Math.floor(Math.random() * (8 - 0 + 1) + 0);
        handleGameEvent({ gameEvent: 'supplyShip', buffIndex });
      }
      if (count > 0) {
        updateState({ waveData: { ...waveData, count: count - 1 } });
      } else {
        const bombers = createBombers(wave, players, gameMode);

        if (bombers.length > 0) {
          handleGameEvent({
            gameEvent: 'bombers',
            bombers,
            wave
          });
        }
        updateState({ waveData: { ...waveData, wave: wave + 1, count: 17 } });
      }
    }
  }

  const syncClocks = (iteration, callback) => {
    const sentTime = Date.now();
    getClockData(sentTime, (timeData) => handleTimeResponse(sentTime, timeData, iteration, callback))
  }

  const handleTimeResponse = (sentTime, timeData, iteration, callback) => {
    const responseTime = Date.now();
    const roundTripTime = responseTime - sentTime;
    handleClockUpdate(roundTripTime, timeData.difference);

    if (iteration > 0) {
      iteration -= 1
      syncClocks(iteration, callback);
    } else {
      callback();
    };
  };

  const handleGameDataResponse = (gameData) => {
    const { clockDifference } = stateRef.current;
    const players = gameData.players.map((player) => {
      const elapsedTime = Date.now() + clockDifference - player.updatedAt
      return player.active ? updatePlayer(player, elapsedTime, clockDifference) : player;
    });
    const received = (response) => handleReceivedEvent(response.playerData);
    const connected = () => updateState({ connected: true })
    const disconnected = () => updateState({ connected: false })
    const gameSocket = createGameSocket(stateRef.current.userId, connected, disconnected, received);
    updateState({ players, gameSocket });
  }

  const handleLeaderBoard = () => {
    fetchScoreData((scoreData) => updateState({ scores: scoreData, modal: 'leaderboard' }))
  }

  const handleGameEvent = (eventPayload) => {
    stateRef.current.gameSocket.create({
      ...eventPayload,
      serverTime: Date.now() + stateRef.current.clockDifference,
      sentAt: Date.now()
    });
  };

  const handleKeyDown = (event) => {
    const { modal, userId, players, startingPlayer } = stateRef.current;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const existingPlayer = findCurrentPlayer(userId, players)
      const currentPlayer = existingPlayer || startingPlayer;
      if (currentPlayer && currentPlayer.active && !stateRef.current[pressedKey]) {
        updateState({ [pressedKey]: true })
        keyDownEvent(pressedKey, stateRef.current, handleGameEvent, updateState, currentPlayer);
      }
    }
  };

  const handleKeyUp = (event) => {
    const { userId, players, startingPlayer } = stateRef.current;
    const existingPlayer = findCurrentPlayer(userId, players)
    const currentPlayer = existingPlayer || startingPlayer;
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !stateRef.current.modal && stateRef.current[pressedKey]) {
      updateState({ [pressedKey]: false });
      keyUpEventPayload(pressedKey, stateRef.current, handleGameEvent, updateState, currentPlayer)
    };
  };

  const handleReceivedEvent = (playerData) => {
    const { clockDifference } = stateRef.current;
    const now = Date.now();
    const elapsedTime = now + clockDifference - playerData.serverTime;

    if (elapsedTime > LATENCY_THRESHOLD) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
    }
    const gameState = handleEventPayload(stateRef.current, playerData, elapsedTime);

    if (gameState) {
      updateState(gameState);
    } else if (playerData?.userId === userId) {
      const roundTripTime = now - playerData.sentAt;
      handleClockUpdate(roundTripTime, playerData.updatedAt - playerData.sentAt);
    }
  };

  const handleClockUpdate = (roundTripTime, difference) => {
    if (roundTripTime < stateRef.current.shortestRoundTripTime) {
      const clockDifference = difference - (roundTripTime / 2)
      console.log('shorter time', roundTripTime)
      console.log('new clock difference', clockDifference)
      updateState({
        clockDifference: clockDifference,
        shortestRoundTripTime: roundTripTime
      });
    };
  };

  const renderGame = () => {
    const currentPlayer = findCurrentPlayer(stateRef.current.userId, stateRef.current.players);
    if (currentPlayer) {

      const updatedGameState = updateGameState(
        stateRef.current,
        handleGameEvent,
        currentPlayer
      );
      updateState(updatedGameState);
    }
  };

  const {
    page,
    modal,
    userId,
    scores,
    aiShips,
    players,
    upgrades,
    activeTab,
    animations,
    abilityData,
    motherships,
    gameOverStats,
    startingPlayer,
    deployedWeapons,
    clockDifference,
    showInstructions
  } = stateRef.current;

  const existingPlayer = findCurrentPlayer(userId, players);
  const activePlayer = existingPlayer || startingPlayer;

  return (
    <div className="layout" onKeyDown={handleKeyDown}>
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
          activePlayer={{ ...activePlayer, inPlayers: !!existingPlayer }}
          gameOverStats={gameOverStats}
          updateState={updateState}
          clockDifference={clockDifference}
          handleGameEvent={handleGameEvent}
        />}
        {['selection', 'nameForm'].includes(modal) && (
          <audio autoPlay loop>
            <source src={introMusic} type="audio/wav" />
          </audio>
        )}
        <Header activePlayer={activePlayer}
          modal={modal}
          clockDifference={clockDifference}
          updateState={updateState}
          handleLeaderBoard={handleLeaderBoard}
          handleGameEvent={handleGameEvent}
        />

        {activePlayer.name && <PlayerData
          activePlayer={activePlayer}
          clockDifference={clockDifference}
          handleGameEvent={handleGameEvent}
          abilityData={abilityData}
          updateState={updateState}
        />}
        <Canvas
          userId={userId}
          players={players}
          aiShips={aiShips}
          animations={animations}
          motherships={motherships}
          currentPlayer={existingPlayer}
          deployedWeapons={deployedWeapons}
        />
      </div>
    </div>
  );
};

export default Layout;

