// upgrades
import shield from '../images/shield.png';
import hitpoints from '../images/hitpointBackground.png';
import speed from '../images/speed.png';
import damage from '../images/damage.png';

export const UPGRADES = [
  {
    index: 0,
    price: 200,
    name: 'Armor',
    image: shield,
    description: 'Upgrades armor by 1 up to 5'
  },
  {
    index: 1,
    price: 200,
    name: 'Hitpoints',
    image: hitpoints,
    description: 'Permanantly increases hitpoints by 200 up 4000'
  },
  {
    index: 2,
    price: 150,
    name: 'Speed',
    image: speed,
    description: 'Permanantly increases speed by 1 up to 6'
  },
  {
    index: 3,
    price: 500,
    name: 'Damage',
    image: damage,
    description: 'Permanantly increases damage by 50 up to 1000'
  }
];
