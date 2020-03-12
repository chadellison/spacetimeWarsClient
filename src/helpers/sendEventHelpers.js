import {WEAPONS} from '../constants/settings.js';
import {
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (pressedKey, state, handleGameEvent, updateState) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(
        state.currentPlayer,
        handleGameEvent,
        updateState,
        state.lastFired
      );
      break;
    case 'left':
    case 'right':
      handleRotateEvent(state.currentPlayer, pressedKey, handleGameEvent);
      break;
    case 'up':
      handleAccelerateEvent(state.currentPlayer, pressedKey, handleGameEvent);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (currentPlayer, players, pressedKey, handleGameEvent, updateState) => {
  if (['right', 'left', 'up'].includes(pressedKey) && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, pressedKey + 'Stop'));
  };

  if ('space' === pressedKey && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, 'fireStop'));
    updateState({currentPlayer: {...currentPlayer, fire: false}});
  };
};

const handleRotateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer && currentPlayer.lastEvent !== 'waiting') {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer && currentPlayer.lastEvent !== 'waiting') {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleSpaceBarEvent = (currentPlayer, handleGameEvent, updateState, lastFired) => {
  if (currentPlayer.lastEvent === 'waiting') {
    handleGameEvent(startEventPayload(currentPlayer));
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
      handleGameEvent(gameEventPayload(currentPlayer, 'fire'));
      const updatedPlayer = {...currentPlayer, fire: true};
      updateState({lastFired: Date.now(), currentPlayer: updatedPlayer});
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
    gold: player.gold + 1,
    score: player.score + 1,
    items: player.items
  }
}

export const startEventPayload = (player) => {
  return {
    id: player.id,
    gameEvent: 'start',
    hitpoints: player.maxHitpoints,
    maxHitpoints: player.maxHitpoints,
    armor: player.armor,
    shipIndex: player.shipIndex,
    weaponIndex: player.weaponIndex,
    velocity: player.velocity,
    gold: player.gold,
    score: player.score,
    items: player.items
  };
}
