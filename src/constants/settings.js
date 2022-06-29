// assets downloaded from: https://member.productioncrate.com/index.php?cratestate=upgraded

// audio
import thrusterAudio from '../audio/thruster.wav';
import windAudio from '../audio/windSound.mov';
import gongAudio from '../audio/gong.wav';
import goldSound from '../audio/goldSound.mp3';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import upgradeAudio from '../audio/upgradeSound.mov';
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
import armorReductionAudio from '../audio/armorReductionSound.mp3';
import missileAudio from '../audio/missile.wav';
import teleportAudio from '../audio/teleportSound.mp3';
import shipExplosionAudio from '../audio/shipExplosionSound.mov';
import zapAudio from '../audio/zapSound.wav';
import backupAudio from '../audio/backupSound.wav';
import homingAudio from '../audio/homingSound.wav';
import crippleAudio from '../audio/crippleSound.wav';

// images
import levelUpAnimation from '../images/levelUpAnimation.png';
import blinkAnimation from '../images/invisibleAnimation.png';
import teleportAnimation from '../images/teleportAnimation.png';
import thrusterAnimation from '../images/thrusterAnimation.png'
import mothershipHitAnimation from '../images/mothershipHitAnimation.png'

// constants
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1125;
export const ANAIMATION_FRAME_RATE = 40;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;

export const thruster = new Audio(thrusterAudio);
thruster.loop = true;
thruster.volume = 0.2;

export const gong = new Audio(gongAudio);
export const goldAudio = new Audio(goldSound);
export const loadWeapon = new Audio(loadWeaponAudio);
export const upgradeSound = new Audio(upgradeAudio);
export const notEnoughResources = new Audio(notEnoughResourcesAudio);
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
export const armorReductionSound = new Audio(armorReductionAudio);
export const missileSound = new Audio(missileAudio);
export const teleportSound = new Audio(teleportAudio);
export const shipExplosionSound = new Audio(shipExplosionAudio);
export const backupSound = new Audio(backupAudio);
export const homingSound = new Audio(homingAudio);
export const crippleSound = new Audio(crippleAudio);
const zap = new Audio(zapAudio);
zap.volume = 0.2;
export const zapSound = zap;

export const GAME_ANIMATIONS = [
  {
    name: 'levelUp',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: levelUpAnimation,
    width: 196,
    height: 237,
    rowCount: 5,
    columnCount: 4,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: -50,
    renderWidth: 150,
    renderHeight: 150
  },
  {
    name: 'blink',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: blinkAnimation,
    width: 115,
    height: 114,
    rowCount: 4,
    columnCount: 5,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: 0,
    renderWidth: 150,
    renderHeight: 150
  },
  {
    name: 'teleport',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: teleportAnimation,
    width: 400,
    height: 225,
    rowCount: 23,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: 0,
    renderWidth: 400,
    renderHeight: 225
  },
  {
    name: 'thruster',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: thrusterAnimation,
    width: 200,
    height: 113,
    renderWidth: 100,
    renderHeight: 56,
    rowCount: 10,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: 0
  },
  {
    name: 'mothershipHit',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: mothershipHitAnimation,
    width: 400,
    height: 225,
    renderWidth: 200,
    renderHeight: 112,
    rowCount: 20,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: 0
  }
];
