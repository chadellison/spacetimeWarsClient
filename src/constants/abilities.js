import nuclearExplosionIcon from '../images/nuclearExplosionIcon.png';
import warpSpeedIcon from '../images/warpSpeedIcon.png';
import mineIcon from '../images/mineIcon.png';
import stunGunIcon from '../images/stunGunIcon.png';
import invulnerabilityIcon from '../images/invulnerabilityIcon.png';
import stealthModeIcon from '../images/stealthMode.png';
import meteorShowerIcon from '../images/meteorShowerIcon.png';
import {
  windSound,
  warpSpeedSound,
  toneSound,
  invulnerableSound,
  mineDropSound,
  stunGunSound,
  meteorShowSound,
} from '../constants/settings.js';

export const ABILITIES = [
  {
    index: 0,
    type: 'weapon',
    description: 'Stuns an enemy ship dealing 200 bonus damage (45s cooldown).',
    cooldown: 45000,
    weaponIndex: 1,
    image: stunGunIcon,
    sound: stunGunSound,
  },
  {
    index: 1,
    type: 'effect',
    description: 'Renders your ship impervious to attacks for seven seconds (60s cooldown).',
    cooldown: 60000,
    effectIndex: 5,
    image: invulnerabilityIcon,
    sound: invulnerableSound,
  },
  {
    index: 2,
    type: 'weapon',
    description: 'Drops mines invisible to enemy ships that deal 600 bonus damage when a ship lands on the mine (50s cooldown).',
    cooldown: 50000,
    weaponIndex: 2,
    image: mineIcon,
    sound: mineDropSound,
  },
  {
    index: 3,
    type: 'effect',
    description: 'Allows the ship to travel extremely fast (+4) for eight seconds (45s cooldown).',
    cooldown: 45000,
    effectIndex: 8,
    image: warpSpeedIcon,
    sound: warpSpeedSound,
  },
  {
    index: 4,
    type: 'weapon',
    description: 'Deploys a massive blast dealing 500 bonus damage to every opponent ship (3 minute cooldown).',
    cooldown: 180000,
    weaponIndex: 0,
    image: nuclearExplosionIcon,
    sound: toneSound,
  },
  {
    index: 5,
    type: 'effect',
    description: 'Renders ship invisible for ten seconds (60s cooldown).',
    cooldown: 60000,
    effectIndex: 4,
    image: stealthModeIcon,
    sound: windSound,
  },
  {
    index: 6,
    type: 'weapon',
    description: 'Fires a cone of meteors each dealing 200 damage (30s cooldown).',
    cooldown: 30000,
    weaponIndex: 3,
    image: meteorShowerIcon,
    sound: meteorShowSound,
  }
]
