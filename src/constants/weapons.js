// weapons
import fireball from '../images/fireball.png';
import displayFireball from '../images/displayFireball.png';
import missile from '../images/missile.png';
import displayMissile from '../images/displayMissile.png';
import trifecta from '../images/trifecta.png';
import displayTrifecta from '../images/displayTrifecta.png';
import plasmaCannon from '../images/plasmaCannon.png';
import displayPlasmaCannon from '../images/displayPlasmaCannon.png';
import bomb from '../images/bomb.png';
import displayBomb from '../images/displayBomb.png';
import laser from '../images/laser.png';
import displayLaser from '../images/displayLaser.png';
import blueFire from '../images/blueFire.png';
import displayBlueFire from '../images/displayBlueFire.png';

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
    damage: 50,
    price: 200,
    width: 16,
    height: 16,
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
    price: 300,
    width: 40,
    height: 15,
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
    damage: 400,
    price: 400,
    width: 50,
    height: 29,
    image: bomb,
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
    price: 500,
    width: 40,
    height: 16,
    image: laser,
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
    damage: 300,
    price: 700,
    width: 32,
    height: 32,
    image: trifecta,
    sound: new Audio(trifectaAudio),
    selectionImage: displayTrifecta
  },
  {
    index: 5,
    name: 'plasmaCannon',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 400,
    speed: 22,
    damage: 350,
    price: 500,
    width: 16,
    height: 16,
    image: plasmaCannon,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayPlasmaCannon
  },
  {
    index: 6,
    name: 'blueFire',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 350,
    speed: 20,
    damage: 700,
    price: 1000,
    width: 20,
    height: 20,
    image: blueFire,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayBlueFire
  }
];
