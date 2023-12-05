// assets downloaded from: https://member.productioncrate.com/index.php?cratestate=upgraded

// audio
import armorReductionAudio from '../audio/armorReductionSound.mp3';
import backupAudio from '../audio/backupSound.wav';
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
import cannonAudio from '../audio/cannon.wav';
import missileAudio from '../audio/missile.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';
import piercerAudio from '../audio/piercerSound.mov';
import poisonDartAudio from '../audio/poisonDartSound2.wav';
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
import gasBombProjectileAudio from '../audio/gasBombProjectileSound2.wav';
import electricFieldProjectileAudio from '../audio/electricFieldProjectileSound.wav';
import crippleAudio from '../audio/crippleSound.wav';

// images
import invisibleAnimation from '../images/invisibleAnimation2.png';
import levelUpAnimation from '../images/levelUpAnimation.png';
import mothershipHitAnimation from '../images/mothershipHitAnimation2.png';
import teleportAnimation from '../images/teleportAnimation.png';
import thrusterAnimation from '../images/thrusterAnimation.png';
import electricField from '../images/electricField.png';
import gasBombAnimation from '../images/gasBombAnimation2.png';
import blackHoleAnimation from '../images/blackHoleAnimation2.png';
import nuclearExplosionAnimation from '../images/nuclearExplosionAnimation.png';
import mineExplosionAnimation from '../images/mineExplosionAnimation.png';
import shipExplosionAnimation from '../images/shipExplosionAnimation.png';

// constants
export const BOARD_WIDTH = 2700;
export const BOARD_HEIGHT = 1688;
export const ANIMATION_FRAME_RATE = 40;
export const WAVE_UPDATE_INTERVAL = 1000;
export const LATENCY_THRESHOLD = 2000;
export const WINDOW_WIDTH_THRESHOLD = 800;
export const REQUEST_COUNT = 3;
export const DRIFT = 2;
export const WAVE_INTERVAL = 17;

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
export const cannonSound = new Audio(cannonAudio);
export const missileSound = new Audio(missileAudio);
export const teleportSound = new Audio(teleportAudio);
export const shipExplosionSound = new Audio(shipExplosionAudio);
export const backupSound = new Audio(backupAudio);
export const homingSound = new Audio(homingAudio);
export const poisonDartSound = new Audio(poisonDartAudio);
export const gasBombProjectileSound = new Audio(gasBombProjectileAudio);
export const electricFieldProjectileSound = new Audio(electricFieldProjectileAudio);
export const crippleSound = new Audio(crippleAudio);

const zap = new Audio(zapAudio);
zap.volume = 0.2;
export const zapSound = zap;
export const EXPLODE_PLAYER_COLOR = 'rgba(151, 7, 7, 0.37)'
export const ROTATIONAL_UNIT = 3;
export const DEFAULT_ABILITY_DATA = {
  q: { lastUsed: 0, level: 0 },
  w: { lastUsed: 0, level: 0 },
  e: { lastUsed: 0, level: 0 },
};

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
    xOffset: 0,
    yOffset: -50,
    renderWidth: 150,
    renderHeight: 150
  },
  {
    name: 'invisible',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: invisibleAnimation,
    width: 256,
    height: 144,
    rowCount: 1,
    columnCount: 151,
    xOffset: 0,
    yOffset: 0,
    renderWidth: 256,
    renderHeight: 144
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
    xOffset: -512,
    yOffset: -288
  },
  {
    name: 'blackHole',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: blackHoleAnimation,
    width: 256,
    height: 144,
    renderWidth: 256,
    renderHeight: 144,
    rowCount: 1,
    columnCount: 170,
    xOffset: -128,
    yOffset: -72,
    isBackground: true
  },
  {
    name: 'nuclearExplosion',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: nuclearExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    xOffset: -500,
    yOffset: -500,
    renderWidth: 1000,
    renderHeight: 1000,
  },
  {
    name: 'spaceMineExplosion',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: mineExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    xOffset: -100,
    yOffset: -100,
    renderWidth: 200,
    renderHeight: 200,
  },
  {
    name: 'shipExplosion',
    location: { x: 0, y: 0 },
    coordinates: { x: 0, y: 0 },
    spriteImage: shipExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    xOffset: -50,
    yOffset: -50,
    renderWidth: 256,
    renderHeight: 256,
  }
];
