import { ABILITY_WEAPONS } from '../constants/weapons.js';
import { ABILITIES } from '../constants/abilities.js';
import { GAME_EFFECTS, NEGATIVE_EFFECT_IDS } from '../constants/effects.js';
import { SHIPS } from '../constants/ships.js';
import { handleFireWeapon, handleAngle, handleLocation, findCenterCoordinates } from '../helpers/gameLogic.js';
import { playSound } from '../helpers/audioHelpers.js';
import { GAME_ANIMATIONS } from '../constants/settings.js';
import { getItem } from './itemHelpers.js';
import { round } from './mathHelpers.js';
import { createEffect } from './effectHelpers.js';

export const handleAbility = ({ players, deployedWeapons, playerData, elapsedTime, animations, aiShips }) => {
  const ability = ABILITIES[SHIPS[playerData.shipIndex].abilities[playerData.usedAbility]];

  let newAnimmations = animations;

  if (ability.animationIndex >= 0) {
    const currentPlayer = players.find(player => player.userId === playerData.userId);
    if (currentPlayer) {
      const location = currentPlayer.location;
      newAnimmations = [...animations, { ...GAME_ANIMATIONS[ability.animationIndex], location, coordinates: { x: 0, y: 0 } }];
    }
  };
  ability.sound && playSound(ability.sound);
  if (ability.type === 'weapon') {
    return addAbilityWeapon(ability.weaponIndex, deployedWeapons, playerData, elapsedTime);
  } else if (ability.type === 'effect') {
    return addAbilityEffect(ability.effectIndex, [...players], playerData, newAnimmations, elapsedTime, aiShips);
  } else {
    return applyOtherAbility([...players], playerData, newAnimmations);
  }
};

const applyOtherAbility = (players, playerData, newAnimmations) => {
  const player = players.find((player) => player.userId === playerData.userId);

  const distance = 400 * playerData.abilityLevel;
  player.location = handleLocation(player.angle, player.location, distance);
  const shipCenter = SHIPS[player.shipIndex].shipCenter;
  const teleportAnimation = { ...GAME_ANIMATIONS[2], coordinates: { x: 0, y: 0 } };
  const coordinates = findCenterCoordinates(player.location, shipCenter, { width: teleportAnimation.renderWidth, height: teleportAnimation.renderHeight })
  teleportAnimation.location = coordinates;
  const udpatedPlayers = players.map(p => p.userId === player.userId ? player : p);
  
  return { players: udpatedPlayers, animations: newAnimmations.concat(teleportAnimation) }
};

const addAbilityWeapon = (weaponIndex, deployedWeapons, playerData, elapsedTime) => {
  const weapon = { ...ABILITY_WEAPONS[weaponIndex], deployedAt: Date.now() - elapsedTime }
  if (weapon.id === 4) {
    return handleMeteorShower(deployedWeapons, playerData, weapon, elapsedTime);
  } else {
    const updatedWeapons = [...deployedWeapons, handleFireWeapon(playerData, weapon, elapsedTime, weapon.damage * playerData.abilityLevel)];
    return { deployedWeapons: updatedWeapons };
  }
};

const addAbilityEffect = (effectIndex, players, playerData, animations, elapsedTime, aiShips) => {
  let updatedPlayers = [...players]
  let updatedAiShips = [...aiShips]
  let player = updatedPlayers.find((p) => p.userId === playerData.userId);

  const duration = GAME_EFFECTS[effectIndex].duration + (playerData.abilityLevel * 1000) - elapsedTime;
  const effectId = GAME_EFFECTS[effectIndex].id;
  const effect = createEffect(effectIndex, duration, player.effects[effectId], playerData.userId);
  
  if (effect.id === 11 || (effect.id === 7 && player.shipIndex === 4)) {
    effect.duration = effect.id === 7 ? 800 + (playerData.abilityLevel * 1000) : effect.duration;
    updatedPlayers = applyEffectToTeam(updatedPlayers, player.team, effect);
    updatedAiShips = applyEffectToTeam(updatedAiShips, player.team, effect);
  } else if ([1, 3, 4, 12, 15].includes(effect.id)) {
    effect.duration *= playerData.abilityLevel;
    const opponentTeam = player.team === 'red' ? 'blue' : 'red';
    updatedPlayers = applyEffectToTeam(updatedPlayers, opponentTeam, effect);
    updatedAiShips = applyEffectToTeam(updatedAiShips, opponentTeam, effect);
  } else if ([5, 14].includes(effect.id)) {
    effect.duration *= playerData.abilityLevel;
    player.effects[effect.id] = effect;

    updatedPlayers = updatedPlayers.map(p => p.userId === player.userId ? player : p);
  } else {
    player.effects[effect.id] = effect;
    updatedPlayers = updatedPlayers.map(p => p.userId === player.userId ? player : p);
  }

  return { players: updatedPlayers, aiShips: updatedAiShips, animations };
};

const applyEffectToTeam = (players, team, effect) => {
  return players.map((player) => {
    if (player.team === team) {
      const duration = getItem(player.items, 12) && NEGATIVE_EFFECT_IDS.includes(effect.id) ? round(effect.duration / 2) : effect.duration;

      player.effects = {
        ...player.effects,
        [effect.id]: {
          ...effect,
          duration,
          animation: effect.animation && { ...effect.animation, coordinates: { x: 0, y: 0 } }
        }
      }
    }
    return player;
  });
};

const handleMeteorShower = (deployedWeapons, player, weapon, elapsedTime) => {
  const angle = handleAngle(player.rotate, player.angle, elapsedTime);
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
      location: handleLocation(weaponAngle, { x, y }, 50),
      trajectory: weaponAngle,
      playerIndex: player.userId,
      team: player.team,
      damage: 200 * player.abilityLevel,
      from: player.type,
    }
  });

  return { deployedWeapons: deployedWeapons.concat(meteors) }
};
