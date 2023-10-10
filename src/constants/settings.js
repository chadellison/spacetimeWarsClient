// assets downloaded from: https://member.productioncrate.com/index.php?cratestate=upgraded

// audio
import armorReductionAudio from '../audio/armorReductionSound.mp3';
import backupAudio from '../audio/backupSound.wav';
import crippleAudio from '../audio/crippleSound.wav';
import damageBoostAudio from '../audio/damageBoostSound.mov';
import damageReductionAudio from '../audio/damageReductionSound.mp3';
import electricFieldAudio from '../audio/electricFieldSound.mov';
import explosionAudio from '../audio/explosionSound.mov';
import goldSound from '../audio/goldSound.mp3';
import gongAudio from '../audio/gong.wav';
import healAudio from '../audio/healSound.mp3';
import homingAudio from '../audio/homingSound.wav';
import invulnerableAudio from '../audio/invulnerableSound.mp3';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import metalClankAudio from '../audio/metalClank.mp3';
import meteorConeAudio from '../audio/meteorConeSound.mov';
import mineDropAudio from '../audio/mineDropSound.mp3';
import mineTriggerAudio from '../audio/mineTriggerSound.mov';
import missileAudio from '../audio/missile.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import piercerAudio from '../audio/piercerSound.mov';
import poisonDartAudio from '../audio/poisonDartSound.wav';
import rapidFireAudio from '../audio/rapidFireSound.mp3';
import shipExplosionAudio from '../audio/shipExplosionSound.mov';
import stunGunAudio from '../audio/stunGunSound.mp3';
import teleportAudio from '../audio/teleportSound.mp3';
import thrusterAudio from '../audio/thruster.wav';
import toneAudio from '../audio/toneSound.mov';
import upgradeAudio from '../audio/upgradeSound.mov';
import warpSpeedAudio from '../audio/warpSpeedSound.mov';
import windAudio from '../audio/windSound.mov';
import zapAudio from '../audio/zapSound.wav';
import electricFieldProjectileAudio from '../audio/electricFieldProjectileSound.wav';

// images
import blinkAnimation from '../images/invisibleAnimation.png';
import levelUpAnimation from '../images/levelUpAnimation.png';
import mothershipHitAnimation from '../images/mothershipHitAnimation2.png';
import teleportAnimation from '../images/teleportAnimation.png';
import thrusterAnimation from '../images/thrusterAnimation.png';
import electricField from '../images/electricField.png';
import gasBombAnimation from '../images/gasBombAnimation2.png';


// constants
export const BOARD_WIDTH = 2700;
export const BOARD_HEIGHT = 1688;
export const ANAIMATION_FRAME_RATE = 40;
export const WAVE_UPDATE_INTERVAL = 1000;
export const LATENCY_THRESHOLD = 2000;
export const WINDOW_WIDTH_THRESHOLD = 800;
export const REQUEST_COUNT = 3;
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
export const poisonDartSound = new Audio(poisonDartAudio);
export const electricFieldProjectileSound = new Audio(electricFieldProjectileAudio);

const zap = new Audio(zapAudio);
zap.volume = 0.2;
export const zapSound = zap;
export const EXPLODE_PLAYER_COLOR = 'rgba(151, 7, 7, 0.37)'

export const GAME_ANIMATIONS = [
  {
    name: 'levelUp',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
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
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
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
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
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
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
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
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: mothershipHitAnimation,
    width: 128,
    height: 128,
    renderWidth: 64,
    renderHeight: 64,
    rowCount: 5,
    columnCount: 5,
    rate: 0,
    startRate: 0,
    xOffset: 0,
    yOffset: 0
  },
  {
    name: 'electricField',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: electricField,
    width: 512,
    height: 288,
    renderWidth: 1024,
    renderHeight: 576,
    rowCount: 7,
    columnCount: 13,
    rate: 0,
    startRate: 0,
    xOffset: -512,
    yOffset: -288
  },
  {
    name: 'gasBomb',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: gasBombAnimation,
    width: 512,
    height: 288,
    renderWidth: 1024,
    renderHeight: 576,
    rowCount: 1,
    columnCount: 91,
    rate: 0,
    startRate: 0,
    xOffset: -512,
    yOffset: -288
  }
];
