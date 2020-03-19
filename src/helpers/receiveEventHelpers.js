import {
  findElapsedTime,
  handleFireWeapon,
  updatePlayer
} from '../helpers/gameLogic.js';

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
  switch (playerData.gameEvent) {
    case 'start':
      return handleStartEvent(players, playerData, deployedWeapons, currentPlayer);
    case 'remove':
      return handleRemoveEvent(players, playerData, deployedWeapons, currentPlayer);
    default:
      return handleUpdateEvent(players, playerData, clockDifference, deployedWeapons, currentPlayer);
  };
}

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
  let updatedWeapons = [...deployedWeapons];

  if (playerData.gameEvent === 'fire') {
    updatedWeapons = [...updatedWeapons, handleFireWeapon(playerData, clockDifference)];
  } else {
    const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
    playerData = updatePlayer(playerData, elapsedTime, clockDifference);
  }

  const updatedPlayers = [...players].map((player) => {
    if (playerData.id === player.id) {
      return playerData;
    } else {
      return player;
    };
  });

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: (currentPlayer.id === playerData.id ? playerData : currentPlayer)
  };
}

const handleStartEvent = (players, playerData, deployedWeapons, currentPlayer) => {
  const updatedPlayers = [...players, playerData];

  return {
    players: updatedPlayers,
    deployedWeapons: deployedWeapons,
    currentPlayer: currentPlayer
  };
}

const handleRemoveEvent = (players, playerData, deployedWeapons, currentPlayer) => {
  let updatedCurrentPlayer = {...currentPlayer};
  const updatedPlayers = [...players].map((player) => {
    if (player.id === playerData.id) {
      if (!player.explode) {
        player.gameEvent = 'remove';
        player.hitpoints = 0;
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
        updatedCurrentPlayer = player;
      };
    };
    return player;
  });

  return {
    players: updatedPlayers,
    deployedWeapons: deployedWeapons,
    currentPlayer: updatedCurrentPlayer
  };
}
