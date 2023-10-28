import { handleFireWeapon, updatePlayer, handlePlayerDamage } from '../helpers/gameLogic.js';
import { applyGameBuff } from '../helpers/effectHelpers.js';
import { GAME_EFFECTS } from '../constants/effects.js';
import { playSound, stopSound } from '../helpers/audioHelpers.js';
import { handleAbility } from '../helpers/abilityHelpers.js';
import {
  thruster,
  shipExplosionSound,
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { WEAPONS } from '../constants/weapons.js';
import { round } from '../helpers/mathHelpers';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {
    userId,
    players,
    aiShips,
    waveData,
    animations,
    motherships,
    deployedWeapons,
    clockDifference,
  } = gameState;
  switch (playerData.gameEvent) {
    case 'start':
      return handleStartEvent({ players, playerData, userId, waveData });
    case 'explode':
      return handleExplodeEvent({ players, aiShips, playerData, elapsedTime, motherships });
    case 'supplyShip':
      return { aiShips: [...aiShips, playerData] };
    case 'bombers':
      return { aiShips: aiShips.concat(playerData.bombers) };
    case 'ability':
      return handleAbility({ players, deployedWeapons, playerData, elapsedTime, animations, aiShips });
    default:
      if (userId !== playerData.userId) {
        return handleUpdateEvent({ players, playerData, clockDifference, deployedWeapons, elapsedTime });
      }
  };
};

const handleBounty = (attacker, explodedPlayer) => {
  const bounty = round(explodedPlayer.maxHitpoints * 0.1);
  attacker.kills += 1
  attacker.gold += bounty;
  attacker.score += bounty;
  return attacker;
};

const handleExplodeEvent = ({ players, aiShips, playerData, elapsedTime, motherships }) => {
  let updatedPlayers = players.map(p => p.userId === playerData.killedBy ? handleBounty(p, playerData) : p);
  
  if (playerData.type === 'human') {
    updatedPlayers = updatedPlayers.map(p => p.userId === playerData.userId ? explodePlayer(p, playerData) : p);
    return { players: updatedPlayers }
  } else {
    if (['redMothership', 'blueMothership'].includes(playerData.name)) {
      return handleGameOver(players, playerData, motherships);
    } else {
      const updatedAiShips = aiShips.map(ship => playerData.id === ship.id && ship.active ? explodePlayer(ship, playerData) : ship);

      if (playerData.type === 'supplyShip') {
        return handleBuff(playerData, updatedPlayers, updatedAiShips, elapsedTime);
      } else {
        return { aiShips: updatedAiShips, players, updatedPlayers };
      }
    }
  }
};

const handleBuff = (playerData, players, aiShips, elapsedTime) => {
  const gameBuff = { ...GAME_EFFECTS[playerData.buffIndex], durationCount: elapsedTime };
  const killedBy = players.find(p => p.userId === playerData.killedBy);
  if (killedBy) {
    const team = killedBy.team;
    const updatedPlayers = applyGameBuff(team, players, gameBuff);
    const updatedAiShips = applyGameBuff(team, aiShips, gameBuff);
    return { players: updatedPlayers, gameBuff: gameBuff, aiShips: updatedAiShips };
  } else {
    return {};
  }
}

export const explodePlayer = (player, playerData) => {
  playSound(shipExplosionSound);
  
  return {
    ...player,
    hitpoints: 0,
    explodeAnimation: { ...GAME_ANIMATIONS[10], coordinates: { x: 0, y: 0 } },
    updatedAt: playerData.updatedAt,
    explodedAt: playerData.explodedAt,
    accelerate: false,
    angle: 0,
    trajectory: 0,
    rotate: 'none',
    effects: {},
    active: false,
    gameEvent: 'waiting'
  }
};

const exploadMothership = (ship) => {
  playSound(shipExplosionSound);
  
  return {
    ...ship,
    hitpoints: 0,
    explodeAnimation: { ...GAME_ANIMATIONS[8], coordinates: { x: 0, y: 0 } },
    effects: {},
    active: false
  }
}

const handleGameOver = (players, playerData, motherships) => {
  return {
    players: players.map(ship => explodePlayer(ship, playerData)),
    aiShips: players.map(ship => explodePlayer(ship, playerData)),
    motherships: motherships.map(ship => exploadMothership(ship)),
    modal: 'gameOver',
    gameOverStats: { playerStats: players, winningTeam: playerData.team === 'red' ? 'Blue' : 'Red' },
    waveData: { wave: 1, count: 5, active: false }
  }
}

const handleStartEvent = ({ players, playerData, userId, waveData }) => {
  let eventPlayer = players.find((player) => player.userId === playerData.userId);
  let newPlayers;
  if (eventPlayer) {
    newPlayers = players.map((player) => {
      if (player.userId === eventPlayer.userId) {
        return playerData;
      } else {
        return player;
      }
    })
  } else {
    newPlayers = [...players, playerData]
  }

  if (userId === playerData.userId) {
    return {
      up: false,
      left: false,
      right: false,
      space: false,
      waveData: { ...waveData, active: true },
      players: newPlayers,
      userId: playerData.userId,
    }
  } else {
    return { players: newPlayers }
  }
};

const handleUpdateEvent = ({ players, playerData, clockDifference, deployedWeapons, elapsedTime }) => {
  let updatedWeapons = deployedWeapons;
  let updatedPlayer = players.find(player => player.userId === playerData.userId);

  switch (playerData.gameEvent) {
    case 'fire':
      if (updatePlayer) {
        updatedWeapons = resolveFireEvent(updatedWeapons, playerData, updatedPlayer, elapsedTime)
      }
      break;
    case 'fireStop':
      break;
    default:
      if (playerData.gameEvent === 'up') {
        playSound(thruster);
      } else if (playerData.gameEvent === 'upStop') {
        stopSound(thruster);
      }
      updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
      break;
  }

  const updatedPlayers = players.map(player => player.userId === playerData.userId ? updatePlayer : player)

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
  };
}

const resolveFireEvent = (updatedWeapons, playerData, updatedPlayer, elapsedTime) => {
  const damage = handlePlayerDamage(updatedPlayer);
  playSound(WEAPONS[updatedPlayer.weaponIndex].sound);  
  return [
    ...updatedWeapons,
    handleFireWeapon(
      playerData,
      { ...WEAPONS[playerData.weaponIndex] },
      elapsedTime,
      damage
    )
  ];
}