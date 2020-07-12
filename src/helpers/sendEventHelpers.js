import {WEAPONS} from '../constants/weapons.js';
import {SHIPS} from '../constants/ships.js';
import {canFire} from '../helpers/gameLogic.js';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../constants/settings.js';

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
      handleAbility(gameState.players[gameState.index], gameState.abilityUsedAt, handleGameEvent, updateState);
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
  const {players, index} = gameState;
  const currentPlayer = players[index]
  if (['right', 'left'].includes(pressedKey) && currentPlayer.name) {
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
  }

  if ('space' === pressedKey && currentPlayer.name) {
    const updatedPlayer = {
      ...currentPlayer,
      gameEvent: 'fireStop'
    };
    handleGameEvent(updatedPlayer);
  };
};

const handleRotateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {players, index} = gameState;
  const currentPlayer = players[index]
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = rotateEventPayload(currentPlayer, pressedKey);
    handleGameEvent(player);
  };
};

const handleAccelerateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {players, index} = gameState;
  const currentPlayer = players[index]
  if (currentPlayer && currentPlayer.gameEvent !== 'waiting') {
    const player = accelerateEventPayload(currentPlayer, pressedKey)
    handleGameEvent(player);
  };
};

const handleSpaceBarEvent = (gameState, handleGameEvent, updateState) => {
  const {lastFired, players} = gameState;
  const currentPlayer = players[gameState.index]
  if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown)) {
    handleGameEvent({...currentPlayer, gameEvent: 'fire'});
    updateState({lastFired: Date.now()});
  };
};

export const startEventPayload = (player) => {
  const startData = getStartData(player.team);
  return {
    ...player,
    gameEvent: 'start',
    location: startData.location,
    angle: startData.angle,
    trajectory: startData.trajectory,
    hitpoints: player.maxHitpoints,
    team: player.team,
    active: true
  };
}

export const getStartData = (team) => {
  if (team === 'red') {
    return {
      location: {x: 60, y: [80, BOARD_HEIGHT - 80][Math.floor(Math.random() * 2)]},
      angle: 1,
      trajectory: 0
    }
  } else {
    return {
      location: {x: BOARD_WIDTH - 60, y: [80, BOARD_HEIGHT - 80][Math.floor(Math.random() * 2)]},
      angle: 181,
      trajectory: 180
    }
  }
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
