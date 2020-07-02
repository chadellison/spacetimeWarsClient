import {handleFireWeapon, updatePlayer} from '../helpers/gameLogic.js';
import {applyGameBuff} from '../helpers/effectHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {playSound, stopSound} from '../helpers/audioHelpers.js';
import {
  thruster,
  supplyPop,
  windSound,
  warpSpeedSound,
  leakSound,
  toneSound,
  invulnerableSound
} from '../constants/settings.js';
import {WEAPONS, ABILITY_WEAPONS} from '../constants/weapons.js';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {players, clockDifference, deployedWeapons, currentPlayer} = gameState;
  switch (playerData.gameEvent) {
    case 'start':
      return handleStartEvent(players, playerData, currentPlayer.id);
    case 'remove':
      return handleRemoveEvent(players, playerData, currentPlayer);
    case 'buff':
      return handleBuffEvent(playerData, players, elapsedTime);
    case 'ability':
      return handleAbility(gameState, playerData, elapsedTime);
    case 'bombers':
      return { players: players.concat(playerData.bombers) };
    case 'leak':
      return handleLeak(playerData, gameState.defenseData);
    case 'gameOver':
      return handleGameOverEvent([...players], playerData)
    default:
      let allPlayers = [...players];
      if (players.filter((player) => player.id === playerData.id).length === 0) {
        allPlayers = [...players, playerData];
      };
      return handleUpdateEvent(allPlayers, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime);
  };
}

const handleLeak = (playerData, defenseData) => {
  const newValue = defenseData[playerData.team] - 1
  playSound(leakSound)
  return { defenseData: {...defenseData, [playerData.team]: newValue}}
}

const handleStartEvent = (players, playerData, currentPlayerId) => {
  if (currentPlayerId === playerData.id) {
    return {
      up: false,
      left: false,
      right: false,
      space: false,
      players: [...players, playerData]
    }
  } else {
    return { players: [...players, playerData] }
  }
}

const handleBuffEvent = (playerData, players, elapsedTime) => {
  const gameBuff = {...GAME_EFFECTS[playerData.buffIndex], durationCount: elapsedTime};
  const updatedPlayers = applyGameBuff(playerData.id, [...players], gameBuff);
  playSound(supplyPop);
  return {players: updatedPlayers, gameBuff: gameBuff};
};

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime) => {
  let updatedWeapons = [...deployedWeapons];
  let updatedPlayer;

  const updatedPlayers = [...players].map((player) => {
    if (playerData.id === player.id) {
      switch (playerData.gameEvent) {
        case 'fire':
          updatedWeapons = [
            ...updatedWeapons,
            handleFireWeapon(playerData, clockDifference, {...WEAPONS[playerData.weaponIndex]}, elapsedTime)
          ];
          updatedPlayer = player
          playSound(WEAPONS[player.weaponIndex].sound);
          break;
        case 'fireStop':
          updatedPlayer = player
          break;
        case 'up':
          updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
          playSound(thruster);
          break;
        case 'upStop':
          updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
          stopSound(thruster);
          break;
        default:
          updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
          break;
      }
      return updatedPlayer;
    } else {
      return player;
    };
  });

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: (currentPlayer.id === playerData.id ? updatedPlayer : currentPlayer)
  };
}

const handleRemoveEvent = (players, playerData, currentPlayer) => {
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
        player.angle = 0;
        player.trajectory = 0;
        player.rotate = 'none';
        player.effects = {};
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
    currentPlayer: updatedCurrentPlayer
  };
}

const handleGameOverEvent = (players, playerData) => {
  const updatedPlayers = players.map((player) => {
    return {...player, explode: true, explodeAnimation: {x: 0, y: 0}}
  });
  return {
    modal: 'gameOver',
    currentPlayer: {},
    players: updatedPlayers,
    gameOverStats: playerData.gameOverStats
  }
}

const handleAbility = (gameState, playerData, elapsedTime) => {
  let updatedPlayers = [...gameState.players];
  let updatedWeapons;
  switch (playerData.shipIndex) {
    case 0:
      let lavaBlast = {...ABILITY_WEAPONS[1], damage: 0, team: playerData.team, playerId: playerData.id}
      updatedWeapons = [
        ...gameState.deployedWeapons,
        handleFireWeapon(playerData, gameState.clockDifference, lavaBlast, elapsedTime)
      ];

      // playSound(lavaBlast sound);
      return {deployedWeapons: updatedWeapons}
    case 1:
      const invulnerableEffect = {...GAME_EFFECTS[5], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [invulnerableEffect.id]: invulnerableEffect};
        }
        return player;
      });
      playSound(invulnerableSound);
      return {players: updatedPlayers};
      // case 2:
        // mines
      //   let nuclearBlast = {...ABILITY_WEAPONS[0], firedAt: Date.now()}
      //   const updatedWeapons = [
      //     ...updatedWeapons,
      //     handleFireWeapon(playerData, gameState.clockDifference, nuclearBlast, elapsedTime)
        // ];
        // updatedPlayer = player
        // playSound(WEAPONS[player.weaponIndex].sound);
        // nuclear blast
        // const warpSpeedEffect = {...GAME_EFFECTS[8], durationCount: elapsedTime};
        // updatedPlayers = [...players].map((player) => {
        //   if (player.id === playerData.id) {
        //     player.effects = {...player.effects, [warpSpeedEffect.id]: warpSpeedEffect};
        //   }
        //   return player;
        // });
        // return {deployedWeapons: updatedWeapons};
    case 3:
      const warpSpeedEffect = {...GAME_EFFECTS[8], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [warpSpeedEffect.id]: warpSpeedEffect};
        }
        return player;
      });
      playSound(warpSpeedSound);
      return {players: updatedPlayers};
    case 4:
      let nuclearBlast = {...ABILITY_WEAPONS[0], damage: 0, deployedAt: Date.now(), team: playerData.team}
      updatedWeapons = [
        ...gameState.deployedWeapons,
        handleFireWeapon(playerData, gameState.clockDifference, nuclearBlast, elapsedTime)
      ];
      playSound(toneSound);
      return {deployedWeapons: updatedWeapons}

    case 5:
      const stealthEffect = {...GAME_EFFECTS[4], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [stealthEffect.id]: stealthEffect};
        }
        return player;
      });
      playSound(windSound);
      return {players: updatedPlayers};
    default:
      return {players: updatedPlayers}
  }
}
