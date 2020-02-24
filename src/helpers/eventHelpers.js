import {KEY_MAP} from '../constants/keyMap.js';
import {WEAPONS} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  handleFireWeapon,
  findCurrentPlayer
} from '../helpers/gameLogic.js';

export const keyDownEventPayload = (keyCode, state) => {
  const currentPlayer = findCurrentPlayer(state.players, state.currentPlayerId);
  switch (KEY_MAP[keyCode]) {
    case 'space':
    case 'enter':
      return handleSpaceBarEvent(currentPlayer, state.userId, state.clockDifference, state.waitingPlayer);
    case 'left':
    case 'right':
      return handleRotateEvent(currentPlayer, KEY_MAP[keyCode]);
    case 'up':
      return handleAccelerateEvent(currentPlayer, KEY_MAP[keyCode]);
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

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayerId, waitingPlayer) => {
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
    waitingPlayer: handleWaitingPlayer(playerData, currentPlayerId, waitingPlayer)
  };
}

const handleWaitingPlayer = (player, currentPlayerId, waitingPlayer) => {
  if (currentPlayerId === player.id) {
    if (waitingPlayer && player.lastEvent === 'start') {
      return null
    } else if (player.lastEvent ===  'explode') {
      return player;
    };
  } else {
    return waitingPlayer;
  };
};

const handleFireEvent = (currentPlayer, clockDifference) => {
  const elapsedTime = findElapsedTime(clockDifference, currentPlayer.lastFired)
  const weaponCooldown = WEAPONS[currentPlayer.weapon].cooldown;
  const canFire = elapsedTime > weaponCooldown
  if (canFire) {
    return {
      id: currentPlayer.id,
      gameEvent: 'fire',
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  };
};

const handleRotateEvent = (currentPlayer, gameEvent) => {
  if (currentPlayer && gameEvent !== currentPlayer.lastEvent) {
    return {
      id: currentPlayer.id,
      gameEvent: gameEvent,
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  };
};

const handleAccelerateEvent = (currentPlayer, gameEvent) => {
  if (currentPlayer && !currentPlayer.accelerate) {
    return {
      id: currentPlayer.id,
      gameEvent: gameEvent,
      location: currentPlayer.location,
      angle: currentPlayer.angle
    };
  };
};

const handleSpaceBarEvent = (currentPlayer, userId, clockDifference, waitingPlayer) => {
  if (!currentPlayer || waitingPlayer) {
     return handleStartEvent(waitingPlayer, userId);
  } else {
    return handleFireEvent(currentPlayer, clockDifference);
  };
};

const handleStartEvent = (waitingPlayer, userId) => {
  if (waitingPlayer) {
    return {
      id: userId,
      gameEvent: 'start',
      hitpoints: waitingPlayer.maxHitpoints,
      maxHitpoints: waitingPlayer.maxHitpoints,
      armor: waitingPlayer.armor,
      lives: waitingPlayer.lives
    };
  } else {
    return {id: userId, gameEvent: 'start', hitpoints: 1000, maxHitpoints: 1000, armor: 1};
  }
}

export const handleExplodeEvent = (player) => {
  return {
    id: player.id,
    gameEvent: 'explode',
    location: player.location,
    angle: player.angle,
    lives: player.lives - 1
  };
};
