import {KEY_MAP} from '../constants/keyMap.js';
import {
  updatePlayer,
  findElapsedTime
} from '../helpers/gameLogic.js';

export const keyDownEventPayload = (keyCode, playerId, userId, players) => {
  switch (KEY_MAP[keyCode]) {
    case 'start':
      return {id: userId, gameEvent: 'start'}
    case 'left':
    case 'right':
      return handleRotateEvent(playerId, players, KEY_MAP[keyCode])
    case 'up':
      return handleAcceleration(playerId, players, KEY_MAP[keyCode])
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
}

export const handleEventPayload = (players, playerData, clockDifference) => {
  if (playerData.lastEvent === 'start') {
    players = [...players, playerData]
  }

  if (playerData.lastEvent === 'remove') {
    players = players.filter((player) => player.id !== playerData.id)
  }

  return players.map((player) => {
    if (player.id === playerData.id) {
      const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
      return updatePlayer(playerData, elapsedTime, clockDifference);
    } else {
      return player;
    };
  });
}

const findCurrentPlayer = (players, playerId) => {
  return players.filter((player) => player.id === playerId)[0];
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
}

const handleAcceleration = (playerId, players, gameEvent) => {
  if (playerId) {
    const currentPlayer = findCurrentPlayer(players, playerId)
    if (gameEvent === 'up' && !currentPlayer.isAccelerating) {
      return {
        id: playerId,
        gameEvent: gameEvent,
        location: currentPlayer.location,
        angle: currentPlayer.angle
      };
    };
  };
};
