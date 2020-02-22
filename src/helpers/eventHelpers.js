import {KEY_MAP} from '../constants/keyMap.js';
import {WEAPONS} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  handleFireWeapon
} from '../helpers/gameLogic.js';

export const keyDownEventPayload = (keyCode, {currentPlayerId, userId, players, clockDifference}) => {
  switch (KEY_MAP[keyCode]) {
    case 'space':
    case 'enter':
      return currentPlayerId ? handleFireEvent(players, currentPlayerId, clockDifference) : handleStartEvent(userId);
    case 'left':
    case 'right':
      return handleRotateEvent(currentPlayerId, players, KEY_MAP[keyCode]);
    case 'up':
      return handleAccelerateEvent(currentPlayerId, players, KEY_MAP[keyCode]);
    default:
      break;
  }
}

export const keyUpEventPayload = (playerId, players, keyCode) => {
  const currentPlayer = findCurrentPlayer(players, playerId);

  if (['right', 'left', 'up'].includes(KEY_MAP[keyCode]) && currentPlayer) {
    return {
      id: playerId,
      gameEvent: KEY_MAP[keyCode] + 'Stop',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  };

  if ('space' === KEY_MAP[keyCode] && currentPlayer) {
    return {
      id: playerId,
      gameEvent: 'fireStop',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  }
}

const playersFromEvent = (gameEvent, players, playerData) => {
  switch (gameEvent) {
    case 'start':
      return [...players, playerData]
    case 'explode':
    case 'remove':
      return players.filter((player) => player.id !== playerData.id)
    default:
      return players;
  };
}

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayerId) => {
  players = playersFromEvent(playerData.lastEvent, players, playerData);

  const updatedWeapons = handleFireWeapon(
    playerData,
    {...WEAPONS[playerData.weapon]},
    deployedWeapons
  );

  const updatedPlayers = players.map((player) => {
    if (player.id === playerData.id) {
      const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
      return updatePlayer(playerData, elapsedTime, clockDifference);
    } else {
      return player;
    };
  });

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    waitingPlayer: handleWaitingPlayer(playerData, currentPlayerId)
  };
}

const handleWaitingPlayer = (player, currentPlayerId) => {
  return currentPlayerId === player.id && player.lastEvent === 'explode' ? player : null;
}

const findCurrentPlayer = (players, playerId) => {
  return players.filter((player) => player.id === playerId)[0];
};

const handleStartEvent = (userId) => {
  return {id: userId, gameEvent: 'start', hitpoints: 1000, maxHitpoints: 1000, armor: 1};
}

const handleFireEvent = (players, playerId, clockDifference) => {
  const currentPlayer = findCurrentPlayer(players, playerId)
  const elapsedTime = findElapsedTime(clockDifference, currentPlayer.lastFired)
  const weaponCooldown = WEAPONS[currentPlayer.weapon].cooldown;
  const canFire = elapsedTime > weaponCooldown
  if (!currentPlayer.fire && canFire) {
    return {
      id: playerId,
      gameEvent: 'fire',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  };
};

const handleRotateEvent = (playerId, players, gameEvent) => {
  if (playerId) {
    const currentPlayer = findCurrentPlayer(players, playerId)
    if (gameEvent !== currentPlayer.lastEvent) {
      return {
        id: playerId,
        gameEvent: gameEvent,
        location: currentPlayer.location,
        angle: currentPlayer.angle
      };
    };
  };
};

const handleAccelerateEvent = (playerId, players, gameEvent) => {
  if (playerId) {
    const currentPlayer = findCurrentPlayer(players, playerId)
    if (!currentPlayer.accelerate) {
      return {
        id: playerId,
        gameEvent: gameEvent,
        location: currentPlayer.location,
        angle: currentPlayer.angle
      };
    };
  };
};

export const handleExplodeEvent = (player) => {
  return {
    id: player.id,
    gameEvent: 'explode',
    location: player.location,
    angle: player.angle,
    lives: player.lives - 1,
    hitpoins: player.maxHitpoints
  };
};
