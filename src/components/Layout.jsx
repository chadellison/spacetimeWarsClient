import React, { useEffect, useRef, useState } from 'react';
import { createGameSocket, fetchScoreData, getClockData, fetchGame } from '../api/gameData';
import introMusic from '../audio/introJingle.wav';
import { KEY_MAP } from '../constants/keyMap.js';
import { ANIMATION_FRAME_RATE, LATENCY_THRESHOLD, REQUEST_COUNT, WAVE_UPDATE_INTERVAL, WINDOW_WIDTH_THRESHOLD, WAVE_INTERVAL, DEFAULT_ABILITY_DATA } from '../constants/settings.js';
import { MOTHER_SHIPS } from '../constants/ships.js';
import { updateGameState } from '../helpers/gameLogic.js';
import { findCurrentPlayer } from '../helpers/playerHelpers';
import { handleEventPayload } from '../helpers/receiveEventHelpers.js';
import { createBombers, keyDownEvent, keyUpEventPayload } from '../helpers/sendEventHelpers.js';
import '../styles/styles.css';
import Canvas from './Canvas';
import Header from './Header';
import { Modal } from './Modal';
import PlayerData from './PlayerData';
import SplashPage from './SplashPage.jsx';

const INITIAL_MODAL = window.innerWidth < WINDOW_WIDTH_THRESHOLD ? 'deviceChageNotification' : 'instructions';

const shouldShowPromo = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const hidePromo = urlParams.get('hidePromo')
  return !sessionStorage.getItem('playedPromoVideo') && !hidePromo;
}

export const DEFAULT_STATE = {
  userId: Date.now(),
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
  winningTeam: '',
  abilityData: DEFAULT_ABILITY_DATA,
  aiShips: [],
  animations: [],
  showInstructions: false,
  scores: [],
  waveData: { wave: 1, count: WAVE_INTERVAL, active: false },
  motherships: MOTHER_SHIPS,
  connected: false,
  game: null,
  started: false,
  showPromo: shouldShowPromo()
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
    syncClocks(REQUEST_COUNT);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const interval = setInterval(renderGame, ANIMATION_FRAME_RATE);
    const waveInterval = setInterval(updateWaveData, WAVE_UPDATE_INTERVAL);

    findAvailableGame();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
      clearInterval(waveInterval);
    }
  }, []);

  const findAvailableGame = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const gameId = urlParams.get('game')

    if (gameId) {
      const handleGameResponse = (gameData => {
        if (gameData?.game) {
          handleSocket(gameData?.game)
          updateState({ modal: 'nameForm', showPromo: false });
        } else {
          alert('the game your are looking for is no longer available!')
        }
      });

      fetchGame(gameId, handleGameResponse);
    }
  };

  const currentPlayer = findCurrentPlayer(stateRef.current.userId, stateRef.current.players) || {};

  const updateWaveData = () => {
    const { waveData, players, started } = stateRef.current;
    const { wave, count } = waveData;

    if (started) {
      if (Math.random() > 0.97) {
        const buffIndex = Math.floor(Math.random() * (8 - 0 + 1) + 0);
        handleGameEvent({ gameEvent: 'supplyShip', buffIndex });
      }
      if (count > 0) {
        updateState({ waveData: { ...waveData, count: count - 1 } });
      } else {
        const bombers = createBombers(wave, players);

        if (bombers.length > 0) {
          handleGameEvent({
            gameEvent: 'bombers',
            bombers,
            wave
          });
        }
        updateState({ waveData: { ...waveData, wave: wave + 1, count: WAVE_INTERVAL } });
      }
    }
  }

  const syncClocks = (iteration) => {
    const sentTime = Date.now();
    getClockData(sentTime, (timeData) => handleTimeResponse(sentTime, timeData, iteration));
  }

  const handleTimeResponse = (sentTime, timeData, iteration) => {
    const responseTime = Date.now();
    const roundTripTime = responseTime - sentTime;
    handleClockUpdate(roundTripTime, timeData.difference);

    if (iteration > 0) {
      iteration -= 1
      syncClocks(iteration);
    }
  };

  const handleLeaderBoard = () => {
    fetchScoreData(scoreData => updateState({ scores: scoreData, modal: 'leaderboard' }))
  };

  const handleGameEvent = (eventPayload) => {
    stateRef.current.gameSocket.create({
      ...eventPayload,
      gameId: stateRef.current.game.id,
      serverTime: Date.now() + stateRef.current.clockDifference,
      sentAt: Date.now()
    });
  };

  const handleKeyDown = (event) => {
    const { modal, userId, players } = stateRef.current;
    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const currentPlayer = findCurrentPlayer(userId, players);
      if (currentPlayer?.active && !stateRef.current[pressedKey]) {
        updateState({ [pressedKey]: true })
        keyDownEvent(pressedKey, stateRef.current, handleGameEvent, updateState, currentPlayer);
      }
    }
  };

  const handleKeyUp = (event) => {
    const { userId, players } = stateRef.current;
    const currentPlayer = findCurrentPlayer(userId, players)
    const pressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer?.active && !stateRef.current.modal && stateRef.current[pressedKey]) {
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
    if (stateRef.current.started) {
      const currentPlayer = findCurrentPlayer(stateRef.current.userId, stateRef.current.players);

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
    game,
    scores,
    aiShips,
    started,
    players,
    upgrades,
    activeTab,
    showPromo,
    connected,
    animations,
    gameSocket,
    winningTeam,
    abilityData,
    motherships,
    deployedWeapons,
    clockDifference,
    showInstructions
  } = stateRef.current;

  const handleSocket = (game) => {
    const received = (response) => handleReceivedEvent(response.playerData);
    const connected = () => updateState({ connected: true })
    const disconnected = () => updateState({ connected: false })
    const gameSocket = createGameSocket({ userId, connected, disconnected, received, gameId: game.id });
    updateState({ gameSocket, game });
  };

  return (
    <div className="layout" onKeyDown={handleKeyDown}>
      <div>
        {
          modal && <Modal
            page={page}
            modal={modal}
            game={game}
            userId={userId}
            scores={scores}
            players={players}
            upgrades={upgrades}
            connected={connected}
            activeTab={activeTab}
            gameSocket={gameSocket}
            handleSocket={(gameData) => handleSocket(gameData.game)}
            showInstructions={showInstructions}
            winningTeam={winningTeam}
            updateState={updateState}
            clockDifference={clockDifference}
            handleGameEvent={handleGameEvent}
            activePlayer={currentPlayer}
          />
        }
        {
          ['selection', 'nameForm'].includes(modal) && (
            <audio autoPlay loop>
              <source src={introMusic} type="audio/wav" />
            </audio>
          )
        }
        <Header activePlayer={currentPlayer}
          modal={modal}
          clockDifference={clockDifference}
          updateState={updateState}
          handleLeaderBoard={handleLeaderBoard}
          handleGameEvent={handleGameEvent}
        />

        {
          currentPlayer.name && <PlayerData
            activePlayer={currentPlayer}
            clockDifference={clockDifference}
            handleGameEvent={handleGameEvent}
            abilityData={abilityData}
            updateState={updateState}
          />
        }
        {showPromo && <SplashPage updateState={updateState} />}
        <Canvas
          userId={userId}
          players={players}
          aiShips={aiShips}
          animations={animations}
          motherships={motherships}
          started={started}
          currentPlayer={currentPlayer}
          deployedWeapons={deployedWeapons}
        />
      </div>
    </div>
  );
};

export default Layout;
