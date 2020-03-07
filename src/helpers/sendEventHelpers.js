import {WEAPONS, SHIPS} from '../constants/settings.js';
import {
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (pressedKey, state, handleGameEvent, updateState) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(
        state.waitingPlayer,
        handleGameEvent,
        updateState,
        state.lastFired
      );
      break;
    case 'left':
    case 'right':
      handleRotateEvent(state.waitingPlayer, pressedKey, handleGameEvent);
      break;
    case 'up':
      handleAccelerateEvent(state.waitingPlayer, pressedKey, handleGameEvent);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (waitingPlayer, players, pressedKey, handleGameEvent, updateState) => {
  if (['right', 'left', 'up'].includes(pressedKey) && waitingPlayer) {
    handleGameEvent(gameEventPayload(waitingPlayer, pressedKey + 'Stop'));
  };

  if ('space' === pressedKey && waitingPlayer) {
    handleGameEvent(gameEventPayload(waitingPlayer, 'fireStop'));
    updateState({isFiring: false});
  };
};

const handleRotateEvent = (waitingPlayer, gameEvent, handleGameEvent) => {
  if (waitingPlayer && waitingPlayer.lastEvent !== 'waiting') {
    handleGameEvent(gameEventPayload(waitingPlayer, gameEvent));
  };
};

const handleAccelerateEvent = (waitingPlayer, gameEvent, handleGameEvent) => {
  if (waitingPlayer && waitingPlayer.lastEvent !== 'waiting') {
    handleGameEvent(gameEventPayload(waitingPlayer, gameEvent));
  };
};

const handleSpaceBarEvent = (waitingPlayer, handleGameEvent, updateState, lastFired) => {
  if (waitingPlayer.lastEvent === 'waiting') {
    handleGameEvent(startEventPayload(waitingPlayer));
  } else {
    if (canFire(lastFired, WEAPONS[waitingPlayer.weaponIndex].cooldown)) {
      handleGameEvent(gameEventPayload(waitingPlayer, 'fire'));
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
    lives: player.lives,
    gold: player.gold + 1,
    score: player.score + 1
  }
}

export const startEventPayload = (player) => {
  return {
    id: player.id,
    gameEvent: 'start',
    hitpoints: player.maxHitpoints,
    maxHitpoints: player.maxHitpoints,
    armor: player.armor,
    lives: player.lives,
    shipIndex: player.shipIndex,
    weaponIndex: player.weaponIndex,
    velocity: SHIPS[player.shipIndex].speed,
    gold: player.gold,
    score: player.score
  };
}
