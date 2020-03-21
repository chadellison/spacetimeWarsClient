import {WEAPONS} from '../constants/weapons.js';
import {
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (
  pressedKey,
  lastFired,
  currentPlayer,
  handleGameEvent,
  updateState,
  updatePlayerState,
  shortestRoundTripTime
) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(currentPlayer, handleGameEvent, updateState, lastFired);
      break;
    case 'left':
    case 'right':
      handleRotateEvent(currentPlayer, pressedKey, handleGameEvent, updatePlayerState, shortestRoundTripTime);
      break;
    case 'up':
      handleAccelerateEvent(currentPlayer, pressedKey, handleGameEvent, updatePlayerState, shortestRoundTripTime);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (currentPlayer, pressedKey, handleGameEvent, updateState, updatePlayerState, shortestRoundTripTime) => {
  if (['right', 'left'].includes(pressedKey) && currentPlayer) {
    handleGameEvent({...currentPlayer, gameEvent: pressedKey + 'Stop', rotate: 'none'});
  };

  if (pressedKey === 'up') {
    const player = {
      ...currentPlayer,
      gameEvent: 'upStop',
      accelerate: false,
      trajectory: currentPlayer.angle
    }
    handleGameEvent(player);
    setTimeout(() => updatePlayerState(player), shortestRoundTripTime / 2)
  }

  if ('space' === pressedKey && currentPlayer) {
    const updatedPlayer = {...currentPlayer, gameEvent: 'fireStop', fire: false};
    handleGameEvent(updatedPlayer);
    updateState({currentPlayer: updatedPlayer});
  };
};

const handleRotateEvent = (currentPlayer, pressedKey, handleGameEvent, updatePlayerState, shortestRoundTripTime) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = {...currentPlayer, gameEvent: pressedKey, rotate: pressedKey};
    handleGameEvent(player);
    setTimeout(() => updatePlayerState(player), shortestRoundTripTime / 2)
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent, updatePlayerState, shortestRoundTripTime) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = {
      ...currentPlayer,
      gameEvent: gameEvent,
      accelerate: true,
      trajectory: currentPlayer.angle
    }
    handleGameEvent(player);
    setTimeout(() => updatePlayerState(player), shortestRoundTripTime / 2)
  };
};

const handleSpaceBarEvent = (currentPlayer, handleGameEvent, updateState, lastFired) => {
  if (currentPlayer.gameEvent === 'waiting') {
    handleGameEvent({...currentPlayer, gameEvent: 'start', hitpoints: currentPlayer.maxHitpoints});
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
      handleGameEvent({...currentPlayer, gameEvent: 'fire', fire: true, gold: currentPlayer.gold + 1, score: currentPlayer.score + 1});
      updateState({lastFired: Date.now()});
    };
  };
};
