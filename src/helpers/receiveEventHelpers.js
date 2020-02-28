import {WEAPONS} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  handleFireWeapon,
  handleGameOver
} from '../helpers/gameLogic.js';

const playersFromEvent = (gameEvent, players, playerData) => {
  switch (gameEvent) {
    case 'start':
      return [...players, playerData]
    default:
      return players;
  };
};

const handleRemoveEvent = (players, playerData) => {
  players.forEach((player) => {
    if (player.id === playerData.id) {
      player.lastEvent = 'remove';
      player.explodeAnimation = {x: 0, y: 0};
      player.explode = true;
      player.updatedAt = playerData.updatedAt;
      player.lives -= 1
      playerData = player;
    };
  });
  return playerData
}

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayerId, waitingPlayer) => {
  players = playersFromEvent(playerData.lastEvent, players, playerData);
  if (playerData.lastEvent === 'remove') {
    playerData = handleRemoveEvent(players, playerData);
  };

  const updatedWeapons = handleFireWeapon(
    playerData,
    {...WEAPONS[playerData.weaponIndex]},
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

  let gameState = {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    waitingPlayer: handleWaitingPlayer(playerData, currentPlayerId, waitingPlayer),
  };

  if (handleGameOver(playerData, currentPlayerId)) {
    gameState.gameOver = true;
    gameState.currentPlayerId = null;
  };
  return gameState;
};

const handleWaitingPlayer = (player, currentPlayerId, waitingPlayer) => {
  if (currentPlayerId === player.id) {
    if (waitingPlayer && player.lastEvent === 'start') {
      return null
    } else if (player.lastEvent === 'remove' && player.lives > 0) {
      return player;
    };
  } else {
    return waitingPlayer;
  };
};
