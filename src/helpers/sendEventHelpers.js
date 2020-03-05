import {WEAPONS, SHIPS} from '../constants/settings.js';
import {
  findCurrentPlayer,
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (pressedKey, state, handleGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(state.players, state.currentPlayerId);
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(
        currentPlayer,
        state.waitingPlayer,
        handleGameEvent,
        updateState,
        state.lastFired
      );
      break;
    case 'left':
    case 'right':
      handleRotateEvent(currentPlayer, pressedKey, handleGameEvent);
      break;
    case 'up':
      handleAccelerateEvent(currentPlayer, pressedKey, handleGameEvent);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (playerId, players, pressedKey, handleGameEvent, updateState) => {
  const currentPlayer = findCurrentPlayer(players, playerId);

  if (['right', 'left', 'up'].includes(pressedKey) && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, pressedKey + 'Stop'));
  };

  if ('space' === pressedKey && currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, 'fireStop'));
    updateState({isFiring: false});
  };
};

const handleRotateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer) {
    handleGameEvent(gameEventPayload(currentPlayer, gameEvent));
  };
};

const handleSpaceBarEvent = (currentPlayer, waitingPlayer, handleGameEvent, updateState, lastFired) => {
  if (waitingPlayer.lastEvent === 'waiting') {
    handleGameEvent(startEventPayload(waitingPlayer));
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
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
