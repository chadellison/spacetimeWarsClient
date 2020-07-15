
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

// constants
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1125;
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
