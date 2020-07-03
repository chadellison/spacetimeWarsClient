import {WEAPONS} from '../constants/weapons.js';
import {SHIPS} from '../constants/ships.js';
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
    case 'q':
      handleAbility(gameState.currentPlayer, gameState.abilityUsedAt, handleGameEvent, updateState);
      break;
    default:
      break;
  }
};

export const keyUpEventPayload = (
  pressedKey,
  gameState,
  handleGameEvent,
  updateState
) => {
  const {currentPlayer, shortestRoundTripTime, players} = gameState;
  if (['right', 'left'].includes(pressedKey) && currentPlayer) {
    handleGameEvent({
      ...currentPlayer,
      gameEvent: pressedKey + 'Stop',
      rotate: 'none'
    });
  };

  if (pressedKey === 'up') {
    const player = {
      ...currentPlayer,
      gameEvent: 'upStop',
      accelerate: false,
      trajectory: currentPlayer.angle
    }
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  }

  if ('space' === pressedKey && currentPlayer) {
    const updatedPlayer = {
      ...currentPlayer,
      gameEvent: 'fireStop'
    };
    handleGameEvent(updatedPlayer);
    updateState({currentPlayer: updatedPlayer});
  };
};

const handleRotateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {currentPlayer, shortestRoundTripTime, players} = gameState;
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = rotateEventPayload(currentPlayer, pressedKey);
    handleGameEvent(player);
    setTimeout(() => updateState({
      currentPlayer: player,
      players: getUpdatedPlayers(player, players)
    }), shortestRoundTripTime / 2);
  };
};

const handleAccelerateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {currentPlayer, shortestRoundTripTime, players} = gameState;
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = accelerateEventPayload(currentPlayer, pressedKey)
    handleGameEvent(player);
    setTimeout(() => updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)}), shortestRoundTripTime / 2);
  };
};

const handleSpaceBarEvent = (gameState, handleGameEvent, updateState) => {
  const {currentPlayer, lastFired} = gameState;
  if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
    handleGameEvent({...currentPlayer, gameEvent: 'fire'});
    updateState({lastFired: Date.now()});
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
    hitpoints: player.maxHitpoints,
    team: player.team
  };
}

const accelerateEventPayload = (player, pressedKey) => {
  return {
    ...player,
    gameEvent: pressedKey,
    accelerate: true,
    trajectory: player.angle
  };
};

const rotateEventPayload = (player, pressedKey) => {
  return {...player, gameEvent: pressedKey, rotate: pressedKey};
}

const handleAbility = (player, abilityUsedAt, handleGameEvent, updateState) => {
  if (Date.now() - abilityUsedAt > SHIPS[player.shipIndex].ability.cooldown) {
    handleGameEvent({...player, gameEvent: 'ability'});
    updateState({abilityUsedAt: Date.now()});
  }
}
