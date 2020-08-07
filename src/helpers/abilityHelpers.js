import {ABILITY_WEAPONS} from '../constants/weapons.js';
import {ABILITIES} from '../constants/abilities.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {SHIPS} from '../constants/ships.js';
import {handleFireWeapon, handleAngle, handleLocation} from '../helpers/gameLogic.js';
import {playSound} from '../helpers/audioHelpers.js';
import {GAME_ANIMATIONS} from '../constants/settings.js';

export const handleAbility = (players, deployedWeapons, playerData, elapsedTime, animations) => {
  const ability = ABILITIES[SHIPS[playerData.shipIndex].abilities[playerData.usedAbility]]
  let newAnimmations = animations;

  if (ability.animationIndex >= 0) {
    const location = players[playerData.index].location;
    newAnimmations = [...animations, {...GAME_ANIMATIONS[ability.animationIndex], location, coordinates: {x: 0, y: 0}}];
  }

  if (ability.type === 'weapon') {
    playSound(ability.sound);
    return addAbilityWeapon(ability.weaponIndex, deployedWeapons, playerData, elapsedTime, playerData.abilityLevel);
  } else if (ability.type === 'effect') {
    playSound(ability.sound);
    return addAbilityEffect(ability.effectIndex, [...players], playerData, elapsedTime, playerData.abilityLevel, newAnimmations);
  }
}

const addAbilityWeapon = (weaponIndex, deployedWeapons, playerData, elapsedTime, abilityLevel) => {
  let weapon = {...ABILITY_WEAPONS[weaponIndex], deployedAt: Date.now() - elapsedTime}
  switch (weapon.id) {
    case 4:
      return handleMeteorShower(deployedWeapons, playerData, weapon, elapsedTime, abilityLevel);
    default:
      const updatedWeapons = [
          ...deployedWeapons,
          handleFireWeapon(
          playerData,
          weapon,
          elapsedTime,
          weapon.damage * abilityLevel
        )
      ];
      return {deployedWeapons: updatedWeapons}
  }
}

const addAbilityEffect = (effectIndex, players, playerData, elapsedTime, abilityLevel, animations) => {
  let updatedPlayers = [...players]
  let player = updatedPlayers[playerData.index]

  let effect = {
    ...GAME_EFFECTS[effectIndex],
    durationCount: elapsedTime,
    duration: GAME_EFFECTS[effectIndex].duration + (abilityLevel * 1000) - 1000
  };

  if (effect.id === 11 || (effect.id === 7 && player.shipIndex === 4)) {
    effect = effect.id === 7 ? {...effect, duration: 800 + (abilityLevel * 1000)} : effect

    updatedPlayers = applyEffectToTeam(updatedPlayers, player.team, effect)
  } else if ([3, 12].includes(effect.id)) {
    const opponentTeam = player.team === 'red' ? 'blue' : 'red';
    updatedPlayers = applyEffectToTeam(updatedPlayers, opponentTeam, effect)
  } else {
    player.effects = {...player.effects, [effect.id]: effect};
    updatedPlayers[playerData.index] = player;
  }
  return  {players: updatedPlayers, animations};
}

const applyEffectToTeam = (players, team, effect) => {
  return players.map((player) => {
    if (player.team === team) {
      player.effects = {...player.effects, [effect.id]: effect}
    }
    return player;
  });
}

const handleMeteorShower = (deployedWeapons, player, weapon, elapsedTime, abilityLevel) => {
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
      damage: 200 * abilityLevel,
    }
  });
  return {deployedWeapons: deployedWeapons.concat(meteors)}
};
