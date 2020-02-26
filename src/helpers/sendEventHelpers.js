import {KEY_MAP} from '../constants/keyMap.js';
import {WEAPONS} from '../constants/settings.js';
import {
  findCurrentPlayer,
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (keyCode, state, handleGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(state.players, state.currentPlayerId);
  switch (KEY_MAP[keyCode]) {
    case 'space':
      handleSpaceBarEvent(
        currentPlayer,
        state.userId,
        state.waitingPlayer,
        handleGameEvent,
        updateState,
        state.lastFired
      );
      break;
    case 'left':
    case 'right':
      handleRotateEvent(currentPlayer, KEY_MAP[keyCode], handleGameEvent);
      break;
    case 'up':
      handleAccelerateEvent(currentPlayer, KEY_MAP[keyCode], handleGameEvent);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (playerId, players, keyCode, handleGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(players, playerId);

  if (['right', 'left', 'up'].includes(KEY_MAP[keyCode]) && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, KEY_MAP[keyCode] + 'Stop'));
  };

  if ('space' === KEY_MAP[keyCode] && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, 'fireStop'));
    updateState({isFiring: false});
  };
};

const handleRotateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer && gameEvent !== currentPlayer.lastEvent) {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer && !currentPlayer.accelerate) {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleSpaceBarEvent = (currentPlayer, userId, waitingPlayer, handleGameEvent, updateState, lastFired) => {
  if (!currentPlayer || waitingPlayer) {
    if (!currentPlayer) {
      updateState({currentPlayerId: userId});
    };
    handleGameEvent(handleStartEvent(waitingPlayer, userId));
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weapon].cooldown)) {
      handleGameEvent(gameEventPayload(currentPlayer, 'fire'));
      updateState({lastFired: Date.now(), isFiring: true});
    };
  };
};

export const gameEventPayload = (player, gameEvent) => {
  return {
    id: player.id,
    gameEvent: gameEvent,
    location: player.location,
    angle: player.angle,
    hitpoints: player.hitpoints,
    lives: player.lives
  }
}

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
