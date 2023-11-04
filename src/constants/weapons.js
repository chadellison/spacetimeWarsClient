import bombAudio from '../audio/bomb.wav';
import cannonAudio from '../audio/cannon.wav';
import crippleAudio from '../audio/crippleSound.wav';
import gasBombReleaseAudio from '../audio/gasBombReleaseSound2.wav';
import laserAudio from '../audio/laser.wav';
import lightLazer from '../audio/lightLazer.mp3';
import missileAudio from '../audio/missile2.wav';
import redPlasmaCannonAudio from '../audio/plasmaCannonSound.wav';
import plasmaCannonAudio from '../audio/plasmaSound.wav';
import stunAudio from '../audio/stunSound.wav';
import trifectaAudio from '../audio/trifecta.wav';
import { explosionSound } from './settings';
// weapons
import blackHoleProjectileAnimation from '../images/blackHoleProjectileAnimation2.png';
import bomb from '../images/bomb.png';
import coldShotAnimation from '../images/coldShotAnimation.png';
import displayBlueFire from '../images/displayBlueFire3.png';
import displayBomb from '../images/displayBomb3.png';
import displayFireball from '../images/displayFireball3.png';
import displayLaser from '../images/displayLaser3.png';
import displayMissile from '../images/displayMissile4.png';
import displayPlasmaCannon from '../images/displayPlasmaCannon2.png';
import displayPoisonCannon from '../images/displayPoisonCannon3.png';
import displayTrifecta from '../images/displayTrifecta3.png';
import electricFieldProjectileAnimation from '../images/electricFieldProjectileAnimation3.png';
import fireballAnimation from '../images/fireballAnimation.png';
import gasBombProjectileAnimation from '../images/gasBombProjectileAnimation.png';
import immolation from '../images/immolation3.png';
import laserAnimation from '../images/laserAnimation.png';
import meteorShowerAnimation from '../images/meteorShowerAnimation.png';
import missile from '../images/missile.png';
import nuclearBlastAnimation from '../images/nuclearBlastAnimation.png';
import piercerAnimation from '../images/piercerAnimation.png';
import poisonCannonAnimation from '../images/poisonCannonAnimation.png';
import poisonDartAnimation from '../images/poisonDartAnimation.png';
import purpleFireAnimation from '../images/purpleFireAnimation.png';
import meteorAnimation from '../images/meteorAnimation2.png';
import spaceMine from '../images/spaceMine3.png';
import stunGunAnimation from '../images/stunBoltAnimation.png';
import trifecta from '../images/trifecta.png';

const AUDIO = [
  { audio: cannonAudio, volume: 0.2 },
  { audio: missileAudio, volume: 0.2 },
  { audio: bombAudio, volume: 0.2 },
  { audio: laserAudio, volume: 0.2 },
  { audio: trifectaAudio, volume: 0.2 },
  { audio: lightLazer, volume: 0.2 },
  { audio: plasmaCannonAudio, volume: 0.2 },
  { audio: redPlasmaCannonAudio, volume: 0.2 },
  { audio: stunAudio, volume: 0.8 },
  { audio: gasBombReleaseAudio, volume: 0.6 },
  { audio: crippleAudio, volume: 0.8 },
].map((audioItem) => {
  const audioObject = new Audio(audioItem.audio);
  audioObject.volume = audioItem.volume;
  return audioObject;
});

export const WEAPONS = [
  {
    index: 0,
    name: 'fireball',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 300,
    speed: 18,
    damage: 60,
    price: 60,
    width: 80,
    height: 40,
    damageRadius: 2,
    ability: 'none',
    sound: AUDIO[0],
    selectionImage: displayFireball,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: fireballAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      startRate: 1,
      renderWidth: 80,
      renderHeight: 40,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    index: 1,
    name: 'missile',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 500,
    speed: 20,
    damage: 100,
    price: 200,
    width: 50,
    height: 46,
    damageRadius: 3,
    ability: 'none',
    sound: AUDIO[1],
    image: missile,
    selectionImage: displayMissile
  },
  {
    index: 2,
    name: 'plasma cannon',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 800,
    speed: 14,
    damage: 400,
    price: 500,
    width: 50,
    height: 29,
    damageRadius: 3,
    ability: 'none',
    sound: AUDIO[2],
    selectionImage: displayBomb,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: nuclearBlastAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      startRate: 1,
      renderWidth: 80,
      renderHeight: 40,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    index: 3,
    name: 'laser cannon',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 300,
    speed: 24,
    damage: 135,
    price: 1050,
    width: 75,
    height: 41,
    damageRadius: 2,
    ability: 'energy steal: 15% of damage dealt will be added to your hitpoints',
    sound: AUDIO[3],
    selectionImage: displayLaser,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: laserAnimation,
      width: 300,
      height: 169,
      rowCount: 24,
      columnCount: 1,
      rate: 1,
      startRate: 1,
      renderWidth: 75,
      renderHeight: 41,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    index: 4,
    name: 'trifecta',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 300,
    speed: 24,
    damage: 140,
    price: 1300,
    width: 32,
    height: 32,
    damageRadius: 2,
    ability: 'critical damage: 20% chance to do double damage',
    image: trifecta,
    sound: AUDIO[4],
    selectionImage: displayTrifecta
  },
  {
    index: 5,
    name: 'poison cannon',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 400,
    speed: 22,
    damage: 40,
    price: 800,
    width: 100,
    height: 50,
    effectIndex: 0,
    damageRadius: 6,
    ability: 'poison damage: drains 17% of opponent\'s total hitpoints over 3 seconds',
    sound: AUDIO[5],
    selectionImage: displayPoisonCannon,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: poisonCannonAnimation,
      width: 128,
      height: 64,
      rowCount: 1,
      columnCount: 6,
      rate: 1,
      startRate: 1,
      renderWidth: 100,
      renderHeight: 50,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    index: 6,
    name: 'blue fire',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 350,
    speed: 18,
    damage: 80,
    price: 300,
    width: 80,
    height: 40,
    effectIndex: 1,
    damageRadius: 5,
    ability: 'cold damage: significanlty slows enemy speed for two seconds',
    sound: AUDIO[6],
    selectionImage: displayBlueFire,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: coldShotAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      startRate: 1,
      renderWidth: 80,
      renderHeight: 40,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    index: 7,
    name: 'piercing cannon',
    location: { x: 0, y: 0 },
    trajectory: 0,
    cooldown: 450,
    speed: 18,
    damage: 190,
    price: 1150,
    width: 128,
    height: 64,
    damageRadius: 6,
    ability: 'armor piercing damage: disregards all armor on enemy ship',
    sound: AUDIO[7],
    selectionImage: displayPlasmaCannon,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: piercerAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      renderWidth: 128,
      renderHeight: 64,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  }
];

export const ABILITY_WEAPONS = [
  {
    id: 1,
    name: 'nuclearBlast',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 7,
    width: 50,
    height: 29,
    damage: 700,
    range: 700,
    countDown: 2000,
    animationIndex: 8,
    sound: explosionSound,
    image: bomb,
  },
  {
    id: 2,
    name: 'stunGun',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 14,
    width: 300,
    height: 169,
    damage: 230,
    damageRadius: 24,
    effectIndex: 3,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: stunGunAnimation,
      width: 300,
      height: 169,
      rowCount: 30,
      columnCount: 1,
      rate: 1,
      renderWidth: 300,
      renderHeight: 169,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 3,
    name: 'spaceMine',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 0,
    width: 100,
    height: 100,
    damageRadius: 30,
    damage: 800,
    image: spaceMine
  },
  {
    id: 4,
    name: 'meteorShower',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 10,
    width: 30,
    height: 30,
    damageRadius: 5,
    damage: 200,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: meteorShowerAnimation,
      width: 128,
      height: 64,
      rowCount: 1,
      columnCount: 5,
      rate: 1,
      renderWidth: 150,
      renderHeight: 75,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 5,
    name: 'piercer',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 14,
    width: 256,
    height: 72,
    damage: 130,
    damageRadius: 6,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: purpleFireAnimation,
      width: 256,
      height: 72,
      rowCount: 1,
      columnCount: 77,
      rate: 1,
      renderWidth: 256,
      renderHeight: 72,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 6,
    name: 'immolation',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 0,
    width: 600,
    height: 338,
    damageRadius: 200,
    damage: 1,
    effectIndex: 1,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: immolation,
      width: 400,
      height: 225,
      renderWidth: 600,
      renderHeight: 338,
      rowCount: 1,
      columnCount: 89,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 7,
    name: 'meteor',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 20,
    width: 192,
    height: 54,
    damageRadius: 15,
    damage: 100,
    effectIndex: 1,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: meteorAnimation,
      width: 192,
      height: 54,
      renderWidth: 192,
      renderHeight: 54,
      rowCount: 1,
      columnCount: 77,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 8,
    name: 'poisonDart',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 12,
    width: 150,
    height: 83,
    damageRadius: 15,
    damage: 800,
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: poisonDartAnimation,
      width: 200,
      height: 113,
      renderWidth: 150,
      renderHeight: 83,
      rowCount: 24,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 9,
    name: 'electricFieldProjectile',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 12,
    width: 256,
    height: 144,
    damage: 0,
    effectIndex: 3,
    animationIndex: 5,
    range: 400,
    countDown: 1500,
    sound: AUDIO[8],
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: electricFieldProjectileAnimation,
      width: 256,
      height: 144,
      renderWidth: 256,
      renderHeight: 144,
      rowCount: 1,
      columnCount: 30,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 10,
    name: 'gasBombProjectile',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 10,
    width: 32,
    height: 32,
    damage: 0,
    effectIndex: 0,
    animationIndex: 6,
    range: 400,
    countDown: 1500,
    sound: AUDIO[9],
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: gasBombProjectileAnimation,
      width: 32,
      height: 32,
      renderWidth: 32,
      renderHeight: 32,
      rowCount: 4,
      columnCount: 7,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 11,
    name: 'blackHoleProjectile',
    location: { x: 0, y: 0 },
    trajectory: 0,
    speed: 9,
    width: 96,
    height: 48,
    damage: 0,
    effectIndex: 14,
    animationIndex: 7,
    range: 300,
    countDown: 1500,
    sound: AUDIO[10],
    animation: {
      coordinates: { x: 0, y: 0 },
      spriteImage: blackHoleProjectileAnimation,
      width: 96,
      height: 48,
      renderWidth: 96,
      renderHeight: 48,
      rowCount: 1,
      columnCount: 6,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
];
