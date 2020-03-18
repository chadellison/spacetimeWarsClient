import {
  findElapsedTime,
  handleFireWeapon,
  handleAngle,
  handleLocation,
  distanceTraveled
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
  let updatedCurrentPlayer = {...currentPlayer};
  let updatedWeapons = [...deployedWeapons];
  const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
  const distance = distanceTraveled(playerData, elapsedTime, clockDifference);
  const trajectory = playerData.accelerate ? playerData.angle : playerData.trajectory;
  playerData.angle = handleAngle(playerData, elapsedTime);
  playerData.location = handleLocation(trajectory, playerData.location, distance)

  if (playerData.gameEvent === 'fire') {
    updatedWeapons = [...updatedWeapons, handleFireWeapon(playerData, clockDifference)];
  }

  const updatedPlayers = [...players].map((player) => {
    if (playerData.id === player.id) {
      if (currentPlayer.id === playerData.id) {
        updatedCurrentPlayer = playerData;
      }
      return playerData;
    } else {
      return player;
    };
  });

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: updatedCurrentPlayer
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
