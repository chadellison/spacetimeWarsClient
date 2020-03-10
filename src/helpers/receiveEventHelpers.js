import {WEAPONS} from '../constants/settings.js';
import {
  updatePlayer,
  findElapsedTime,
  handleFireWeapon
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

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
  players = playersFromEvent(playerData.lastEvent, players, playerData);

  let updatedPlayers = players;
  let updatedWeapons = deployedWeapons;
  if (playerData.lastEvent === 'remove') {
    playerData = handleRemoveEvent(players, playerData);
  } else if (playerData.lastEvent === 'fire') {
    updatedWeapons = handleFireWeapon(
      playerData,
      {...WEAPONS[playerData.weaponIndex]},
      deployedWeapons
    );
  } else {
    updatedPlayers = players.map((player) => {
      if (player.id === playerData.id) {
        const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
        return updatePlayer(playerData, elapsedTime, clockDifference);
      } else {
        return player;
      };
    });
  }

  let gameState = {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: handleWaitingPlayer(playerData, currentPlayer),
  };

  return gameState;
};

const handleWaitingPlayer = (player, currentPlayer) => {
  if (currentPlayer.id === player.id) {
    return player;
  } else {
    return currentPlayer;
  };
};
