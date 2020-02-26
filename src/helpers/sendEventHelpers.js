import {KEY_MAP} from '../constants/keyMap.js';
import {WEAPONS} from '../constants/settings.js';
import {
  findCurrentPlayer,
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (keyCode, state, sendGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(state.players, state.currentPlayerId);
  switch (KEY_MAP[keyCode]) {
    case 'space':
      handleSpaceBarEvent(
        currentPlayer,
        state.userId,
        state.waitingPlayer,
        sendGameEvent,
        updateState,
        state.lastFired
      );
      break;
    case 'left':
    case 'right':
      handleRotateEvent(currentPlayer, KEY_MAP[keyCode], sendGameEvent);
      break;
    case 'up':
      handleAccelerateEvent(currentPlayer, KEY_MAP[keyCode], sendGameEvent);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (playerId, players, keyCode, handleGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(players, playerId);

  if (['right', 'left', 'up'].includes(KEY_MAP[keyCode]) && currentPlayer) {
    handleGameEvent({
      id: playerId,
      gameEvent: KEY_MAP[keyCode] + 'Stop',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    });
  };

  if ('space' === KEY_MAP[keyCode] && currentPlayer) {
    handleGameEvent({
      id: playerId,
      gameEvent: 'fireStop',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    });
    updateState({isFiring: false});
  };
};

const handleRotateEvent = (currentPlayer, gameEvent, sendGameEvent) => {
  if (currentPlayer && gameEvent !== currentPlayer.lastEvent) {
    sendGameEvent({
      id: currentPlayer.id,
      gameEvent: gameEvent,
      location: currentPlayer.location,
      angle: currentPlayer.angle
    });
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, sendGameEvent) => {
  if (currentPlayer && !currentPlayer.accelerate) {
    sendGameEvent({
      id: currentPlayer.id,
      gameEvent: gameEvent,
      location: currentPlayer.location,
      angle: currentPlayer.angle
    });
  };
};

const handleSpaceBarEvent = (currentPlayer, userId, waitingPlayer, sendGameEvent, updateState, lastFired) => {
  if (!currentPlayer || waitingPlayer) {
    if (!currentPlayer) {
      updateState({currentPlayerId: userId});
    };
    sendGameEvent(handleStartEvent(waitingPlayer, userId));
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weapon].cooldown)) {
      sendGameEvent({
        id: currentPlayer.id,
        gameEvent: 'fire',
        location: currentPlayer.location,
        angle: currentPlayer.angle
      });
      updateState({lastFired: Date.now(), isFiring: true});
    };
  };
};

const handleStartEvent = (waitingPlayer, userId) => {
  if (waitingPlayer) {
    return {
      id: userId,
      gameEvent: 'start',
      hitpoints: waitingPlayer.maxHitpoints,
      maxHitpoints: waitingPlayer.maxHitpoints,
      armor: waitingPlayer.armor,
      lives: waitingPlayer.lives
    };
  } else {
    return {
      id: userId,
      gameEvent: 'start',
      hitpoints: 1000,
      maxHitpoints: 1000,
      armor: 1,
      lives: 3
    };
  }
}
