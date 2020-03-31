import {WEAPONS} from '../constants/weapons.js';
import {canFire} from '../helpers/gameLogic.js';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';
import {START_DATA} from '../constants/settings.js';

export const keyDownEvent = (pressedKey, gameState, handleGameEvent, updateState) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(gameState, handleGameEvent, updateState);
      break;
    case 'left':
    case 'right':
      handleRotateEvent(gameState, pressedKey, handleGameEvent, updateState);
      break;
    case 'up':
      handleAccelerateEvent(gameState, pressedKey, handleGameEvent, updateState);
      break;
    default:
      break;
  }
}

export const keyUpEventPayload = (
  pressedKey,
  gameState,
  handleGameEvent,
  updateState
) => {
  const {currentPlayer, clockDifference, shortestRoundTripTime, players} = gameState;
  if (['right', 'left'].includes(pressedKey) && currentPlayer) {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: pressedKey + 'Stop',
      rotate: 'none',
      sentTime: Date.now() + clockDifference
    });
  };

  if (pressedKey === 'up') {
    const player = {
      ...currentPlayer,
      gameEvent: 'upStop',
      accelerate: false,
      trajectory: currentPlayer.angle,
      sentTime: Date.now() + clockDifference
    }
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  }

  if ('space' === pressedKey && currentPlayer) {
    const updatedPlayer = {
      ...currentPlayer,
      gameEvent: 'fireStop',
      sentTime: Date.now() + clockDifference
    };
    handleGameEvent(updatedPlayer);
    updateState({currentPlayer: updatedPlayer});
  };
};

const handleRotateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {currentPlayer, clockDifference, shortestRoundTripTime, players} = gameState;
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = rotateEventPayload(currentPlayer, pressedKey, clockDifference);
    handleGameEvent(player);
    setTimeout(() => updateState({
      currentPlayer: player,
      players: getUpdatedPlayers(player, players)
    }), shortestRoundTripTime / 2);
  };
};

const handleAccelerateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {currentPlayer, clockDifference, shortestRoundTripTime, players} = gameState;
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = accelerateEventPayload(currentPlayer, pressedKey, clockDifference)
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  };
};

const handleSpaceBarEvent = (gameState, handleGameEvent, updateState) => {
  const {currentPlayer, lastFired, clockDifference} = gameState;
  if (currentPlayer.gameEvent === 'waiting') {
    handleGameEvent(startEventPayload(currentPlayer))
  } else {
    if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
      handleGameEvent(fireEventPayload(currentPlayer, clockDifference));
      updateState({lastFired: Date.now() + clockDifference});
    };
  };
};

export const startEventPayload = (player) => {
  const startData = START_DATA[Math.floor(Math.random() * START_DATA.length)];
  return {
    ...player,
    gameEvent: 'start',
    location: startData.location,
    angle: startData.angle,
    trajectory: startData.trajectory,
    hitpoints: player.maxHitpoints
  };
}

export const fireEventPayload = (player, clockDifference) => {
  return {
    ...player,
    gameEvent: 'fire',
    sentTime: Date.now() + clockDifference
  };
}

const accelerateEventPayload = (player, pressedKey, clockDifference) => {
  return {
    ...player,
    gameEvent: pressedKey,
    accelerate: true,
    trajectory: player.angle,
    sentTime: Date.now() + clockDifference
  };
}

const rotateEventPayload = (player, pressedKey, clockDifference) => {
  return {
    ...player,
    gameEvent: pressedKey,
    rotate: pressedKey,
    sentTime: Date.now() + clockDifference
  };
}
