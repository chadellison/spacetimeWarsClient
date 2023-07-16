import React, { useEffect, useState, useRef } from 'react';
import { createGameSocket, fetchGameData, fetchScoreData, getClockData } from '../api/gameData';
import { KEY_MAP } from '../constants/keyMap.js';
import { ANAIMATION_FRAME_RATE, REQUEST_COUNT } from '../constants/settings.js';
import { mothershipItems, motherships } from '../constants/ships.js';
import { updateGameState, updatePlayer } from '../helpers/gameLogic.js';
import { findCurrentPlayer } from '../helpers/playerHelpers';
import { handleEventPayload } from '../helpers/receiveEventHelpers.js';
import { createBombers, keyDownEvent, keyUpEventPayload } from '../helpers/sendEventHelpers.js';
import '../styles/styles.css';
import Canvas from './Canvas';
import Header from './Header';
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
};

const Layout = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  const stateRef = useRef(state);
  const updateState = (newState) => {
    const updatedState = {...stateRef.current, ...newState};
    setState(updatedState);
    stateRef.current = updatedState;
  }

  useEffect(() => {
    syncClocks(REQUEST_COUNT, () => fetchGameData(handleGameDataResponse));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const interval = setInterval(renderGame, ANAIMATION_FRAME_RATE);
    const waveInterval = setInterval(updateWaveData, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
      clearInterval(waveInterval);
    }
  }, [])

  const updateWaveData = () => {
    const { waveData, players, userId, startingPlayer } = stateRef.current;
    const { wave, count, active } = waveData;
    if (active) {
      if (Math.random() > 0.97) {
        handleGameEvent({ gameEvent: 'supplyShip' });
      }
      if (count > 0) {
        updateState({ waveData: { ...waveData, count: count - 1 } });
      } else {
        const existingPlayer = findCurrentPlayer(userId, players);
        const currentPlayer = existingPlayer || startingPlayer;
        const opponentTeam = currentPlayer.team === 'red' ? 'blue' : 'red';
        const bombers = createBombers(wave, opponentTeam, players);

        if (bombers) {
          handleGameEvent({
            gameEvent: 'bombers',
            team: opponentTeam,
            bombers
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
      if (player.active) {
        return updatePlayer(player, elapsedTime, clockDifference)
      } else {
        return player;
      }
    });
    const received = (response) => handleReceivedEvent(response.playerData);
    const gameSocket = createGameSocket(stateRef.current.userId, received);
    updateState({ players, gameSocket });
  }

  const handleLeaderBoard = () => {
    fetchScoreData((scoreData) => updateState({ scores: scoreData, modal: 'leaderboard' }))
  }

  const handleGameEvent = (eventPayload) => {
    stateRef.current.gameSocket.create({
      ...eventPayload,
      serverTime: Date.now() + stateRef.current.clockDifference,
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
    const elapsedTime = Date.now() + clockDifference - playerData.serverTime;

    if (elapsedTime > 2000) {
      console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime)
    }
    const gameState = handleEventPayload(stateRef.current, playerData, elapsedTime);

    if (gameState) {
      updateState(gameState);
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

  const resetGame = () => {
    const newState = {
      ...DEFAULT_STATE,
      motherships: motherships.map((ship) => ({ ...ship, hitpoints: 5000, maxHitpoints: 5000, items: { ...mothershipItems }, effects: {} })),
      userId: stateRef.current.userId,
      clockDifference: stateRef.current.clockDifference,
      shortestRoundTripTime: stateRef.current.shortestRoundTripTime,
    }
    updateState(newState);
    syncClocks(3, () => fetchGameData(handleGameDataResponse));
  }

  const renderGame = () => {
    const currentPlayer = findCurrentPlayer(stateRef.current.userId, stateRef.current.players);
    if (currentPlayer) {

      const updatedGameState = updateGameState(
        stateRef.current,
        handleGameEvent,
        syncClocks,
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
    } = stateRef.current;

    const existingPlayer = findCurrentPlayer(userId, players);
    const activePlayer = existingPlayer || startingPlayer;

    return (
      <div className="layout" onKeyDown={handleKeyDown}>
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
            resetGame={resetGame}
            activePlayer={{ ...activePlayer, inPlayers: existingPlayer }}
            gameOverStats={gameOverStats}
            updateState={updateState}
            clockDifference={clockDifference}
            handleGameEvent={handleGameEvent}
          />}
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
            currentPlayer={existingPlayer}
            players={players}
            aiShips={aiShips}
            animations={animations}
            motherships={motherships}
            deployedWeapons={deployedWeapons}
          />
        </div>
      </div>
    );
  };

export default Layout;

