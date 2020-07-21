import {ABILITY_WEAPONS} from '../constants/weapons.js';
import {ABILITIES} from '../constants/abilities.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {SHIPS} from '../constants/ships.js';
import {handleFireWeapon, handleAngle, handleLocation} from '../helpers/gameLogic.js';
import {playSound} from '../helpers/audioHelpers.js';
import {round} from '../helpers/mathHelpers';

export const handleAbility = (gameState, playerData, elapsedTime) => {
  let updatedPlayers = [...gameState.players];
  const ability = ABILITIES[SHIPS[playerData.shipIndex].abilities[playerData.usedAbility]]
  if (ability.type === 'weapon') {
    playSound(ability.sound);
    return addAbilityWeapon(ability.weaponIndex, gameState, playerData, elapsedTime);
  } else if (ability.type === 'effect') {
    playSound(ability.sound);
    return addAbilityEffect(ability.effectIndex, updatedPlayers, gameState, playerData, elapsedTime);
  }
}

const addAbilityWeapon = (weaponIndex, gameState, playerData, elapsedTime) => {
  let weapon = {...ABILITY_WEAPONS[weaponIndex], deployedAt: Date.now() - elapsedTime}
  switch (weapon.id) {
    case 4:
      return handleMeteorShower(gameState.deployedWeapons, playerData, weapon, elapsedTime);
    // case 6:
    //   handleElectricField(gameState.deployedWeapons, playerData, weapon, elapsedTime);
    default:
      const updatedWeapons = [
          ...gameState.deployedWeapons,
          handleFireWeapon(
          playerData,
          weapon,
          elapsedTime,
          weapon.damage + round(playerData.score / 50)
        )
      ];
      return {deployedWeapons: updatedWeapons}
  }
}

const addAbilityEffect = (effectIndex, players, gameState, playerData, elapsedTime) => {
  let updatedPlayers = [...players]
  let player = updatedPlayers[playerData.index]

  const effect = {
    ...GAME_EFFECTS[effectIndex],
    durationCount: elapsedTime,
    duration: GAME_EFFECTS[effectIndex].duration + round(player.score / 5)
  };

  if (effect.id === 11) {
    updatedPlayers = applyEffectToTeam(updatedPlayers, player.team, effect)
  } else if (effect.id === 13) {
    const team = player.team === 'red' ? 'blue' : 'red';
    updatedPlayers = applyEffectToTeam(updatedPlayers, team, effect)
  } else {
    player.effects = {...player.effects, [effect.id]: effect};
    updatedPlayers[playerData.index] = player;
  }
  return {players: updatedPlayers};
}

const applyEffectToTeam = (players, team, effect) => {
  return players.map((player) => {
    if (player.team === team) {
      player.effects = {...player.effects, [effect.id]: effect}
    }
    return player;
  });
}

const handleMeteorShower = (deployedWeapons, player, weapon, elapsedTime) => {
  const angle = handleAngle(player, elapsedTime);
  const meteors = [-40, -20, 0, 20, 40].map((degree) => {
    let weaponAngle = angle + degree
    if (weaponAngle < 0) {
      weaponAngle += 360
    } else if (weaponAngle > 360) {
      weaponAngle -= 360
    }
    const location = player.location;
    const shipCenter = SHIPS[player.shipIndex].shipCenter;
    const x = location.x + shipCenter.x - (weapon.width / 2);
    const y = location.y + shipCenter.y - (weapon.height / 2);

    return {
      ...weapon,
      location: handleLocation(weaponAngle, {x, y}, 50),
      trajectory: weaponAngle,
      playerIndex: player.index,
      team: player.team,
      damage: 200 + round(player.score / 50),
    }
  });
  return {deployedWeapons: deployedWeapons.concat(meteors)}
};
