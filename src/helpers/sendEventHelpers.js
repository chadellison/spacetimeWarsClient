import {WEAPONS} from '../constants/settings.js';
import {
  canFire
} from '../helpers/gameLogic.js';

export const keyDownEvent = (pressedKey, lastFired, currentPlayer, handleGameEvent, updateState) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(currentPlayer, handleGameEvent, updateState, lastFired);
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

export const keyUpEventPayload = (currentPlayer, pressedKey, handleGameEvent, updateState) => {
  if (['right', 'left'].includes(pressedKey) && currentPlayer) {
    handleGameEvent({...currentPlayer, gameEvent: pressedKey + 'Stop', rotate: 'none'});
  };

  if (pressedKey === 'up') {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: 'upStop',
      accelerate: false,
      trajectory: currentPlayer.angle
    });
  }

  if ('space' === pressedKey && currentPlayer) {
    const updatedPlayer = {...currentPlayer, gameEvent: 'fireStop', fire: false};
    handleGameEvent(updatedPlayer);
    updateState({currentPlayer: updatedPlayer});
  };
};

const handleRotateEvent = (currentPlayer, pressedKey, handleGameEvent) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    handleGameEvent({...currentPlayer, gameEvent: pressedKey, rotate: pressedKey});
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: gameEvent,
      accelerate: true,
      trajectory: currentPlayer.angle
    });
  };
};

const handleSpaceBarEvent = (currentPlayer, handleGameEvent, updateState, lastFired) => {
  if (currentPlayer.gameEvent === 'waiting') {
    handleGameEvent({...currentPlayer, gameEvent: 'start', hitpoints: currentPlayer.maxHitpoints});
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
      handleGameEvent({...currentPlayer, gameEvent: 'fire', fire: true, gold: currentPlayer.gold + 1, score: currentPlayer.score + 1});
      const updatedPlayer = {...currentPlayer, fire: true};
      updateState({lastFired: Date.now(), currentPlayer: updatedPlayer});
    };
  };
};
