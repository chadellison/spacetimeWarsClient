// upgrades
import { API_RESOURCE_URL } from '../api/apiHelpers.js';

const shield = `${API_RESOURCE_URL}/shield`;
const hitpoints = `${API_RESOURCE_URL}/hitpointBackground`;
const speed = `${API_RESOURCE_URL}/speed`;
const damage = `${API_RESOURCE_URL}/damage`;
// import shield from '../images/shield.png';
// import hitpoints from '../images/hitpointBackground.png';
// import speed from '../images/speed.png';
// import damage from '../images/damage.png';

export const UPGRADES = [
  {
    index: 0,
    name: 'Armor',
    image: shield,
    description: 'Upgrades armor by 1'
  },
  {
    index: 1,
    name: 'Hitpoints',
    image: hitpoints,
    description: 'Permanantly increases hitpoints by 300'
  },
  {
    index: 2,
    name: 'Speed',
    image: speed,
    description: 'Permanantly increases speed by 1'
  },
  {
    index: 3,
    name: 'Damage',
    image: damage,
    description: 'Permanantly increases damage by 50'
  }
];
