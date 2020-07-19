import nuclearExplosionIcon from '../images/nuclearExplosionIcon.png';
import warpSpeedIcon from '../images/warpSpeedIcon.png';
import mineIcon from '../images/mineIcon.png';
import stunGunIcon from '../images/stunGunIcon.png';
import invulnerabilityIcon from '../images/invulnerabilityIcon.png';
import stealthModeIcon from '../images/stealthMode.png';
import meteorShowerIcon from '../images/meteorShowerIcon.png';
import healingIcon from '../images/healthBoost.jpg';
import piercerIcon from '../images/piercerIcon.png';
import rapidFireIcon from '../images/rapidFireIcon.png';
import damageBoostIcon from '../images/damageBoostIcon.png';
import hiddenAttackIcon from '../images/hiddenAttackIcon.png';
import {
  windSound,
  warpSpeedSound,
  toneSound,
  invulnerableSound,
  mineDropSound,
  stunGunSound,
  damageBoostSound,
  piercerSound,
  clokingSound,
  healSound,
  rapidFireSound,
  meteorConeSound,
} from '../constants/settings.js';

export const ABILITIES = [
  {
    index: 0,
    type: 'weapon',
    description: 'Stuns an enemy ship for 3 seconds and deals 350 damage (45s cooldown).',
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
    sound: meteorConeSound,
  },
  {
    index: 7,
    type: 'effect',
    description: 'Boosts hitpoints to %50 of max hitpoints (90 second cooldown)',
    cooldown: 90000,
    effectIndex: 6,
    image: healingIcon,
    sound: healSound,
  },
  {
    index: 8,
    type: 'weapon',
    description: 'Fires a weapon that tears through ships by traveling through them (40s cooldown).',
    cooldown: 40000,
    weaponIndex: 4,
    image: piercerIcon,
    sound: piercerSound,
  },
  {
    index: 9,
    type: 'effect',
    description: 'Enables your ship to fire twice as fast for 15 seconds (40s cooldown).',
    cooldown: 40000,
    effectIndex: 9,
    image: rapidFireIcon,
    sound: rapidFireSound,
  },
  {
    index: 10,
    type: 'effect',
    description: 'Provides a 25% damage boost to all allied units for for 12 seconds (45s cooldown).',
    cooldown: 45000,
    effectIndex: 10,
    image: damageBoostIcon,
    sound: damageBoostSound,
  },
  {
    index: 11,
    type: 'effect',
    description: 'Renders your weapons invisible for 5 seconds (55s cooldown)',
    cooldown: 55000,
    effectIndex: 11,
    image: hiddenAttackIcon,
    sound: clokingSound,
  }
]
