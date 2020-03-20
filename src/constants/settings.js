
// audio
import thrusterAudio from '../audio/thruster.wav';
import gongAudio from '../audio/gong.wav';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import upgradeAudio from '../audio/upgrade.wav';

// constants
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1125;
export const ANAIMATION_FRAME_RATE = 40;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
export const SPRITE_WIDTH = 256;
export const SPRITE_ROW_COUNT = 8;
export const SPRITE_COLUMN_COUNT = 6;

export const thruster = new Audio(thrusterAudio);
thruster.loop = true;

export const gong = new Audio(gongAudio);
export const loadWeapon = new Audio(loadWeaponAudio);
export const upgradeSound = new Audio(upgradeAudio);
export const notEnoughResources = new Audio(notEnoughResourcesAudio);
