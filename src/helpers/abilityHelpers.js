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

  let updatedWeapons;
  let currentPlayer = {...gameState.currentPlayer}
  switch (playerData.shipIndex) {
    case 0:
      let lavaBlast = {...ABILITY_WEAPONS[1]}
      updatedWeapons = [
        ...gameState.deployedWeapons,
        handleFireWeapon(playerData, gameState.clockDifference, lavaBlast, elapsedTime, lavaBlast.damage + playerData.damage)
      ];
      playSound(stunGunSound);
      return {deployedWeapons: updatedWeapons}
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
      let spaceMine = {...ABILITY_WEAPONS[2]}
      updatedWeapons = [
        ...gameState.deployedWeapons,
        handleFireWeapon(playerData, gameState.clockDifference, spaceMine, elapsedTime, spaceMine.damage + playerData.damage)
      ];
      playSound(mineDropSound);
      return {deployedWeapons: updatedWeapons}
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
      let nuclearBlast = {...ABILITY_WEAPONS[0], deployedAt: Date.now()}
      updatedWeapons = [
        ...gameState.deployedWeapons,
        handleFireWeapon(playerData, gameState.clockDifference, nuclearBlast, elapsedTime, nuclearBlast.damage + playerData.damage)
      ];
      playSound(toneSound);
      return {deployedWeapons: updatedWeapons}
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
