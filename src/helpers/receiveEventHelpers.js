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

const handleRemoveEvent = (players, playerData, currentPlayer) => {
  players.forEach((player) => {
    if (player.id === playerData.id) {
      if (!player.explode) {
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
      }
      if (playerData.id === currentPlayer.id) {
        currentPlayer = player;
      };
    };
  });

  return playerData
}

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
  let updatedPlayers = playersFromEvent(playerData.lastEvent, players, playerData);;
  let updatedWeapons = deployedWeapons;
  if (playerData.lastEvent === 'remove') {
    playerData = handleRemoveEvent(updatedPlayers, playerData, currentPlayer);
  } else if (playerData.lastEvent === 'fire') {
    updatedWeapons = handleFireWeapon(
      playerData,
      {...WEAPONS[playerData.weaponIndex]},
      deployedWeapons
    );
  } else {
    updatedPlayers = updatedPlayers.map((player) => {
      if (player.id === playerData.id) {
        const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
        return updatePlayer(playerData, elapsedTime, clockDifference);
      } else {
        return player;
      };
    });
  }

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: currentPlayer
  };
};
