
// audio
import thrusterAudio from '../audio/thruster.wav';
import supplyPopAudio from '../audio/supplyPop.wav';
import gongAudio from '../audio/gong.wav';
import goldSound from '../audio/goldSound.mp3';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import upgradeAudio from '../audio/upgradeSound.mov';

// constants
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1125;
export const ANAIMATION_FRAME_RATE = 40;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
export const SPRITE_WIDTH = 256;
export const SPRITE_ROW_COUNT = 8;
export const SPRITE_COLUMN_COUNT = 6;
export const START_DATA = [
  { location: {x: 60, y: 60}, angle: 0, trajectory: 0},
  { location: {x: 60, y: BOARD_HEIGHT - 80}, angle: 1, trajectory: 0},
  { location: {x: BOARD_WIDTH - 60, y: 60}, angle: 181, trajectory: 180},
  { location: {x: BOARD_WIDTH - 60, y: BOARD_HEIGHT - 80}, angle: 181, trajectory: 180}
];

export const thruster = new Audio(thrusterAudio);
thruster.loop = true;

export const gong = new Audio(gongAudio);
export const goldAudio = new Audio(goldSound);
export const loadWeapon = new Audio(loadWeaponAudio);
export const upgradeSound = new Audio(upgradeAudio);
export const notEnoughResources = new Audio(notEnoughResourcesAudio);
export const supplyPop = new Audio(supplyPopAudio);
