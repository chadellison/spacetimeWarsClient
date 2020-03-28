import {WEAPONS} from '../constants/weapons.js';
import {canFire} from '../helpers/gameLogic.js';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';

export const keyDownEvent = (
  pressedKey,
  lastFired,
  currentPlayer,
  handleGameEvent,
  updateState,
  shortestRoundTripTime,
  players
) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(currentPlayer, handleGameEvent, updateState, lastFired);
      break;
    case 'left':
    case 'right':
      handleRotateEvent(currentPlayer, pressedKey, handleGameEvent, shortestRoundTripTime, players, updateState);
      break;
    case 'up':
      handleAccelerateEvent(currentPlayer, pressedKey, handleGameEvent, shortestRoundTripTime, players, updateState);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (
  currentPlayer,
  pressedKey,
  handleGameEvent,
  updateState,
  shortestRoundTripTime,
  players
) => {
  if (['right', 'left'].includes(pressedKey) && currentPlayer) {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: pressedKey + 'Stop',
      rotate: 'none',
      sentTime: Date.now()
    });
  };

  if (pressedKey === 'up') {
    const player = {
      ...currentPlayer,
      gameEvent: 'upStop',
      accelerate: false,
      trajectory: currentPlayer.angle,
      sentTime: Date.now()
    }
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  }

  if ('space' === pressedKey && currentPlayer) {
    const updatedPlayer = {
      ...currentPlayer,
      gameEvent: 'fireStop',
      fire: false,
      sentTime: Date.now()
    };
    handleGameEvent(updatedPlayer);
    updateState({currentPlayer: updatedPlayer});
  };
};

const handleRotateEvent = (currentPlayer, pressedKey, handleGameEvent, shortestRoundTripTime, players, updateState) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = {...currentPlayer, gameEvent: pressedKey, rotate: pressedKey, sentTime: Date.now()};
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent, handleGameEvent, shortestRoundTripTime, players, updateState) => {
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = {
      ...currentPlayer,
      gameEvent: gameEvent,
      accelerate: true,
      trajectory: currentPlayer.angle,
      sentTime: Date.now()
    }
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  };
};

const handleSpaceBarEvent = (currentPlayer, handleGameEvent, updateState, lastFired) => {
  if (currentPlayer.gameEvent === 'waiting') {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: 'start',
      hitpoints:
      currentPlayer.maxHitpoints,
      sentTime: Date.now()
    });
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
      handleGameEvent({
        ...currentPlayer,
        gameEvent: 'fire',
        fire: true,
        sentTime: Date.now()
      });
      updateState({lastFired: Date.now()});
    };
  };
};
