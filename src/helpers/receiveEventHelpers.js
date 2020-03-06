import {WEAPONS} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  handleFireWeapon,
  handleGameOver
} from '../helpers/gameLogic.js';

const playersFromEvent = (gameEvent, players, playerData) => {
  if (gameEvent === 'start') {
    players = [...players, playerData]
  }
  return players;
};

const handleRemoveEvent = (players, playerData) => {
  players.forEach((player) => {
    if (player.id === playerData.id && !player.explode) {
      player.lastEvent = 'remove';
      player.explodeAnimation = {x: 0, y: 0};
      player.explode = true;
      player.updatedAt = playerData.updatedAt;
      player.lives -= 1;
      player.accelerate = false;
      player.fire = false;
      player.angle = 0;
      player.trajectory = 0;
      player.rotate = 'none';
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
    gameState.waitingPlayer = {};
    gameState.activeTab = 'Ship';
  };
  return gameState;
};

const handleWaitingPlayer = (player, currentPlayerId, waitingPlayer) => {
  if (currentPlayerId === player.id) {
    return player;
  } else {
    return waitingPlayer;
  };
};
