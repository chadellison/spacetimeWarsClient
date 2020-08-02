
// audio
import thrusterAudio from '../audio/thruster.wav';
import supplyPopAudio from '../audio/supplyPop.wav';
import windAudio from '../audio/windSound.mov';
import gongAudio from '../audio/gong.wav';
import goldSound from '../audio/goldSound.mp3';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import upgradeAudio from '../audio/upgradeSound.mov';
import leakAudio from '../audio/leakSound.mov';
import warpSpeedAudio from '../audio/warpSpeedSound.mov';
import toneAudio from '../audio/toneSound.mov';
import invulnerableAudio from '../audio/invulnerableSound.mp3';
import explosionAudio from '../audio/explosionSound.mov';
import mineTriggerAudio from '../audio/mineTriggerSound.mov';
import mineDropAudio from '../audio/mineDropSound.mp3';
import stunGunAudio from '../audio/stunGunSound.mp3';
import damageBoostAudio from '../audio/damageBoostSound.mov';
import meteorConeAudio from '../audio/meteorConeSound.mov';
import piercerAudio from '../audio/piercerSound.mov';
import metalClankAudio from '../audio/metalClank.mp3';
import healAudio from '../audio/healSound.mp3';
import rapidFireAudio from '../audio/rapidFireSound.mp3';
import damageReductionAudio from '../audio/damageReductionSound.mp3';
import electricFieldAudio from '../audio/electricFieldSound.mov';

// animations
import levelupAnimation from '../images/levelupAnimation.png'

// constants
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1125;
export const EVENT_DIVIDER = 200;
export const ANAIMATION_FRAME_RATE = 40;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;

export const thruster = new Audio(thrusterAudio);
thruster.loop = true;

export const gong = new Audio(gongAudio);
export const goldAudio = new Audio(goldSound);
export const loadWeapon = new Audio(loadWeaponAudio);
export const upgradeSound = new Audio(upgradeAudio);
export const leakSound = new Audio(leakAudio);
export const notEnoughResources = new Audio(notEnoughResourcesAudio);
export const supplyPop = new Audio(supplyPopAudio);
export const windSound = new Audio(windAudio);
export const warpSpeedSound = new Audio(warpSpeedAudio);
export const toneSound = new Audio(toneAudio);
export const invulnerableSound = new Audio(invulnerableAudio);
export const explosionSound = new Audio(explosionAudio);
export const mineTriggerSound = new Audio(mineTriggerAudio);
export const mineDropSound = new Audio(mineDropAudio);
export const stunGunSound = new Audio(stunGunAudio);
export const meteorConeSound = new Audio(meteorConeAudio);
export const damageBoostSound = new Audio(damageBoostAudio);
export const piercerSound = new Audio(piercerAudio);
export const metalClank = new Audio(metalClankAudio);
export const healSound = new Audio(healAudio);
export const rapidFireSound = new Audio(rapidFireAudio);
export const damageReductionSound = new Audio(damageReductionAudio);
export const electricFieldSound = new Audio(electricFieldAudio);

export const levelup = {
  coordinates: {x: 0, y: 0},
  spriteImage: levelupAnimation,
  width: 128,
  height: 128,
  renderWidth: 100,
  renderHeight: 100,
  rowCount: 4,
  columnCount: 4,
  rate: 1,
  startRate: 1,
  xOffset: 0,
  yOffset: -75,
}
