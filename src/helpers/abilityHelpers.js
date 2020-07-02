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

export const handleAbility = (gameState, playerData, elapsedTime) => {
  let updatedPlayers = [...gameState.players];
  if (updatedPlayers.filter((player) => player.id === playerData.id).length === 0) {
    updatedPlayers = [...updatedPlayers, playerData];
  };

  let currentPlayer = {...gameState.currentPlayer}
  switch (playerData.shipIndex) {
    case 0:
      return addAbilityWeapon(1, gameState, playerData, stunGunSound, elapsedTime);
    case 1:
      const invulnerableEffect = {...GAME_EFFECTS[5], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [invulnerableEffect.id]: invulnerableEffect};
          currentPlayer = playerData.id === currentPlayer.id ? player : currentPlayer;
        }
        return player;
      });
      playSound(invulnerableSound);
      return {players: updatedPlayers, currentPlayer};
    case 2:
      return addAbilityWeapon(2, gameState, playerData, mineDropSound, elapsedTime);
    case 3:
      const warpSpeedEffect = {...GAME_EFFECTS[8], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [warpSpeedEffect.id]: warpSpeedEffect};
          currentPlayer = playerData.id === currentPlayer.id ? player : currentPlayer;
        }
        return player;
      });
      playSound(warpSpeedSound);
      return {players: updatedPlayers, currentPlayer};
    case 4:
      return addAbilityWeapon(0, gameState, playerData, toneSound, elapsedTime);
    case 5:
      const stealthEffect = {...GAME_EFFECTS[4], durationCount: elapsedTime};
      updatedPlayers = updatedPlayers.map((player) => {
        if (player.id === playerData.id) {
          player.effects = {...player.effects, [stealthEffect.id]: stealthEffect};
          currentPlayer = playerData.id === currentPlayer.id ? player : currentPlayer;
        }
        return player;
      });
      playSound(windSound);
      return {players: updatedPlayers, currentPlayer};
    default:
      return {players: updatedPlayers}
  }
}

const addAbilityWeapon = (weaponIndex, gameState, playerData, sound, elapsedTime) => {
  let weapon = {...ABILITY_WEAPONS[weaponIndex], deployedAt: Date.now()}
  const updatedWeapons = [
    ...gameState.deployedWeapons,
    handleFireWeapon(playerData, gameState.clockDifference, weapon, elapsedTime, weapon.damage + playerData.damage)
  ];
  playSound(sound);
  return {deployedWeapons: updatedWeapons}
}
