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

import cannonAudio from '../audio/cannon.wav';
import missileAudio from '../audio/missile.wav';
import trifectaAudio from '../audio/trifecta.wav';
import bombAudio from '../audio/bomb.wav';
import plasmaCannonAudio from '../audio/plasmaSound.wav';
import laserAudio from '../audio/laser.wav';

export const WEAPONS = [
  {
    index: 0,
    name: 'fireball',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 18,
    damage: 90,
    price: 100,
    width: 16,
    height: 16,
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
    damage: 150,
    price: 200,
    width: 40,
    height: 15,
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
    damage: 330,
    price: 400,
    width: 50,
    height: 29,
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
    damage: 200,
    price: 950,
    width: 40,
    height: 16,
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
    damage: 150,
    price: 1100,
    width: 32,
    height: 32,
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
    damage: 200,
    price: 900,
    width: 16,
    height: 16,
    ability: 'poison damage: deals 17% damage of the total hitpoints over 3 seconds',
    image: poisonCannon,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayPoisonCannon
  },
  {
    index: 6,
    name: 'blueFire',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 350,
    speed: 20,
    damage: 200,
    price: 825,
    width: 20,
    height: 20,
    ability: 'cold damage: significanlty slows enemy speed for one second',
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
    damage: 180,
    price: 750,
    width: 20,
    height: 20,
    ability: 'armor piercing damage: disregards all armor on enemy ship',
    image: plasmaCannon,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayPlasmaCannon
  }
];
