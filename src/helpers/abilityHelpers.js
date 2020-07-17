import {ABILITY_WEAPONS} from '../constants/weapons.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {handleFireWeapon} from '../helpers/gameLogic.js';
import {playSound} from '../helpers/audioHelpers.js';
import {
  windSound,
  warpSpeedSound,
  toneSound,
  invulnerableSound,
  mineDropSound,
  stunGunSound
} from '../constants/settings.js';
import {round} from '../helpers/mathHelpers';

export const handleAbility = (gameState, playerData, elapsedTime) => {
  let updatedPlayers = [...gameState.players];
  if (updatedPlayers.filter((player) => player.id === playerData.id).length === 0) {
    updatedPlayers = [...updatedPlayers, playerData];
  };

  switch (playerData.shipIndex) {
    case 0:
      return addAbilityWeapon(1, gameState, playerData, stunGunSound, elapsedTime);
    case 1:
      return addAbilityEffect(5, updatedPlayers, gameState, playerData, invulnerableSound, elapsedTime);
    case 2:
      return addAbilityWeapon(2, gameState, playerData, mineDropSound, elapsedTime);
    case 3:
      return addAbilityEffect(8, updatedPlayers, gameState, playerData, warpSpeedSound, elapsedTime);
    case 4:
      return addAbilityWeapon(0, gameState, playerData, toneSound, elapsedTime);
    case 5:
      return addAbilityEffect(4, updatedPlayers, gameState, playerData, windSound, elapsedTime);
    default:
      return {players: updatedPlayers}
  }
}

const addAbilityWeapon = (weaponIndex, gameState, playerData, sound, elapsedTime) => {
  let weapon = {...ABILITY_WEAPONS[weaponIndex], deployedAt: Date.now()}
  const updatedWeapons = [
    ...gameState.deployedWeapons,
    handleFireWeapon(
      playerData,
      weapon,
      elapsedTime,
      weapon.damage + round(playerData.score / 50)
    )
  ];
  playSound(sound);
  return {deployedWeapons: updatedWeapons}
}

const addAbilityEffect = (effectIndex, players, gameState, playerData, sound, elapsedTime) => {
  let updatedPlayers = [...players]
  let player = updatedPlayers[playerData.index]

  const effect = {
    ...GAME_EFFECTS[effectIndex],
    durationCount: elapsedTime,
    duration: GAME_EFFECTS[effectIndex].duration + round(player.score / 5)
  };

  player.effects = {...player.effects, [effect.id]: effect};
  updatedPlayers[playerData.index] = player;
  playSound(sound);
  return {players: updatedPlayers};
}
