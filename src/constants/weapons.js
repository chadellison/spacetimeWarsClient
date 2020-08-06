// weapons
import fireball from '../images/fireball.png';
import displayFireball from '../images/displayFireball.png';
import missile from '../images/missile.png';
import displayMissile from '../images/displayMissile.png';
import trifecta from '../images/trifecta.png';
import displayTrifecta from '../images/displayTrifecta.png';
import poisonCannon from '../images/poisonCannon.png';
import displayPoisonCannon from '../images/displayPoisonCannon.png';
import bomb from '../images/bomb.png';
import displayBomb from '../images/displayBomb.png';
import laser from '../images/laser.png';
import displayLaser from '../images/displayLaser.png';
import blueFire from '../images/blueFire.png';
import displayBlueFire from '../images/displayBlueFire.png';
import plasmaCannon from '../images/plasmaCannon.png';
import displayPlasmaCannon from '../images/displayPlasmaCannon.png';
import spaceMine from '../images/spaceMine.png';
import nuclearExplosionAnimation from '../images/nuclearExplosionAnimation.png';
import mineExplosionAnimation from '../images/mineExplosionAnimation.png';
import nuclearBlastAnimation from '../images/nuclearBlastAnimation.png';
import shipExplosionAnimation from '../images/shipExplosionAnimation.png';
import stunGunAnimation from '../images/stunGunAnimation.png';
import meteorShowerAnimation from '../images/meteorShowerAnimation.png';
import piercerAnimation from '../images/piercerAnimation.png';
import electricFieldAnimation from '../images/electricFieldAnimation.png';

import cannonAudio from '../audio/cannon.wav';
import missileAudio from '../audio/missile.wav';
import trifectaAudio from '../audio/trifecta.wav';
import bombAudio from '../audio/bomb.wav';
import plasmaCannonAudio from '../audio/plasmaSound.wav';
import laserAudio from '../audio/laser.wav';
import lightLazer from '../audio/lightLazer.mp3';
import mediumLaser from '../audio/mediumLaser.mp3';

export const WEAPONS = [
  {
    index: 0,
    name: 'fireball',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 18,
    damage: 60,
    price: 100,
    width: 16,
    height: 16,
    damageRadius: 2,
    ability: 'none',
    sound: new Audio(cannonAudio),
    image: fireball,
    selectionImage: displayFireball
  },
  {
    index: 1,
    name: 'missile',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 500,
    speed: 20,
    damage: 100,
    price: 200,
    width: 40,
    height: 15,
    damageRadius: 2,
    ability: 'none',
    sound: new Audio(missileAudio),
    image: missile,
    selectionImage: displayMissile
  },
  {
    index: 2,
    name: 'bomb',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 800,
    speed: 14,
    damage: 220,
    price: 400,
    width: 50,
    height: 29,
    damageRadius: 3,
    image: bomb,
    ability: 'none',
    sound: new Audio(bombAudio),
    selectionImage: displayBomb
  },
  {
    index: 3,
    name: 'laser',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 24,
    damage: 135,
    price: 950,
    width: 40,
    height: 16,
    damageRadius: 2,
    image: laser,
    ability: 'energy steal: 15% of damage dealt will be added to your hitpoints',
    sound: new Audio(laserAudio),
    selectionImage: displayLaser
  },
  {
    index: 4,
    name: 'trifecta',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 24,
    damage: 100,
    price: 1300,
    width: 32,
    height: 32,
    damageRadius: 2,
    ability: 'critical damage: 20% chance to do double damage',
    image: trifecta,
    sound: new Audio(trifectaAudio),
    selectionImage: displayTrifecta
  },
  {
    index: 5,
    name: 'poisonCannon',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 400,
    speed: 22,
    damage: 80,
    price: 690,
    width: 16,
    height: 16,
    damageRadius: 3,
    ability: 'poison damage: drains 17% of opponent\'s total hitpoints over 3 seconds',
    image: poisonCannon,
    sound: new Audio(lightLazer),
    selectionImage: displayPoisonCannon
  },
  {
    index: 6,
    name: 'blueFire',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 350,
    speed: 20,
    damage: 115,
    price: 500,
    width: 20,
    height: 20,
    damageRadius: 3,
    ability: 'cold damage: significanlty slows enemy speed for two seconds',
    image: blueFire,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayBlueFire
  },
  {
    index: 7,
    name: 'plasmaCannon',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 450,
    speed: 18,
    damage: 130,
    price: 750,
    width: 20,
    height: 20,
    damageRadius: 3,
    ability: 'armor piercing damage: disregards all armor on enemy ship',
    image: plasmaCannon,
    sound: new Audio(mediumLaser),
    selectionImage: displayPlasmaCannon
  }
];

export const ABILITY_WEAPONS = [
  {
    id: 1,
    name: 'nuclearBlast',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 7,
    width: 4,
    height: 4,
    damage: 300,
    animation: {
      coordinates: {x: 0, y: 0},
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
    id: 2,
    name: 'stunGun',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 14,
    width: 120,
    height: 60,
    damage: 230,
    damageRadius: 12,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunGunAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      renderWidth: 120,
      renderHeight: 60,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 3,
    name: 'spaceMine',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 0,
    width: 80,
    height: 80,
    damageRadius: 16,
    damage: 400,
    image: spaceMine
  },
  {
    id: 4,
    name: 'meteorShower',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 10,
    width: 20,
    height: 20,
    damageRadius: 3,
    damage: 200,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: meteorShowerAnimation,
      width: 128,
      height: 64,
      rowCount: 1,
      columnCount: 5,
      rate: 1,
      renderWidth: 100,
      renderHeight: 50,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 5,
    name: 'piercer',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 14,
    width: 120,
    height: 60,
    damage: 80,
    damageRadius: 4,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: piercerAnimation,
      width: 128,
      height: 64,
      rowCount: 4,
      columnCount: 2,
      rate: 1,
      renderWidth: 120,
      renderHeight: 60,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 6,
    name: 'electricField',
    location: {x: 0, y: 0},
    trajectory: 0,
    speed: 0,
    width: 400,
    height: 400,
    damageRadius: 125,
    damage: 1,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: electricFieldAnimation,
      width: 256,
      height: 256,
      renderWidth: 400,
      renderHeight: 400,
      rowCount: 4,
      columnCount: 7,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  }
]

export const EXPLOSION_ANIMATIONS = [
  {
    id: 1,
    name: 'spaceMineExplosion',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: mineExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: -100,
    yOffset: -100,
    renderWidth: 200,
    renderHeight: 200,
  },
  {
    id: 2,
    name: 'nuclearExplosion',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: nuclearExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: -500,
    yOffset: -500,
    renderWidth: 1000,
    renderHeight: 1000,
  },
  {
    id: 3,
    name: 'shipExplosion',
    location: {x: 0, y: 0},
    coordinates: {x: 0, y: 0},
    spriteImage: shipExplosionAnimation,
    width: 256,
    height: 256,
    rowCount: 36,
    columnCount: 1,
    rate: 0,
    startRate: 0,
    xOffset: -50,
    yOffset: -50,
    renderWidth: 200,
    renderHeight: 200,
  }
]
