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
import damageReductionIcon from '../images/damageReductionIcon.png';
import electricFieldIcon from '../images/electricFieldIcon.png';
import armorReductionIcon from '../images/armorReductionIcon.png';
import redMeteorIcon from '../images/redMeteorIcon.png';
import teleportIcon from '../images/teleportIcon.png';
import armorBoost from '../images/armorBoost.png';
import {
  windSound,
  warpSpeedSound,
  toneSound,
  invulnerableSound,
  mineDropSound,
  stunGunSound,
  damageBoostSound,
  piercerSound,
  metalClank,
  healSound,
  rapidFireSound,
  meteorConeSound,
  damageReductionSound,
  electricFieldSound,
  armorReductionSound,
  teleportSound,
} from '../constants/settings.js';

export const ABILITIES = [
  {
    index: 0,
    type: 'weapon',
    description: 'Stuns an enemy ship for 3 seconds and deals (230, 460, 690) damage ("Q" key to use; 40s cooldown).',
    cooldown: 40000,
    weaponIndex: 1,
    image: stunGunIcon,
    sound: stunGunSound,
  },
  {
    index: 1,
    type: 'effect',
    description: 'Renders the ship impervious to attacks for (five, six, seven) seconds ("Q" key to use; 60s cooldown).',
    cooldown: 60000,
    effectIndex: 5,
    image: invulnerabilityIcon,
    sound: invulnerableSound,
  },
  {
    index: 2,
    type: 'weapon',
    description: 'Drops invisible mines dealing (400, 800, 1200) damage when an enemy ship travels over the mine ("Q" key to use; 50s cooldown).',
    cooldown: 50000,
    weaponIndex: 2,
    image: mineIcon,
    sound: mineDropSound,
  },
  {
    index: 3,
    type: 'effect',
    description: 'Allows the ship to travel at warp speed (+4) for (eight, nine, ten) seconds ("Q" key to use; 45s cooldown).',
    cooldown: 45000,
    effectIndex: 8,
    image: warpSpeedIcon,
    sound: warpSpeedSound,
  },
  {
    index: 4,
    type: 'weapon',
    description: 'Deploys a nuclear blast dealing (300, 600, 900) damage to every opponent ship ("Q" key to use; 3 minute cooldown).',
    cooldown: 90000,
    weaponIndex: 0,
    image: nuclearExplosionIcon,
    sound: toneSound,
  },
  {
    index: 5,
    type: 'effect',
    description: 'Renders the ship invisible for (10, 11, 12) seconds ("Q" key to use; 60s cooldown).',
    cooldown: 60000,
    effectIndex: 4,
    image: stealthModeIcon,
    sound: windSound,
    animationIndex: 1,
  },
  {
    index: 6,
    type: 'weapon',
    description: 'Fires a cone of meteors each dealing (200, 400, 600) damage ("W" key to use; 30s cooldown).',
    cooldown: 30000,
    weaponIndex: 3,
    image: meteorShowerIcon,
    sound: meteorConeSound,
  },
  {
    index: 7,
    type: 'effect',
    description: 'Boosts hitpoints to %50 of max hitpoints ("E" key to use; 90 second cooldown)',
    cooldown: 90000,
    effectIndex: 6,
    image: healingIcon,
    sound: healSound,
  },
  {
    index: 8,
    type: 'weapon',
    description: 'Fires a projectile that travels through enemy ships dealing catastrophic damage ("W" key to use; 30s cooldown).',
    cooldown: 30000,
    weaponIndex: 4,
    image: piercerIcon,
    sound: piercerSound,
  },
  {
    index: 9,
    type: 'effect',
    description: 'Enables the ship to fire at rapid speed (twice as fast) for (10, 11, 12) seconds ("W" key to use; 40s cooldown).',
    cooldown: 40000,
    effectIndex: 9,
    image: rapidFireIcon,
    sound: rapidFireSound,
  },
  {
    index: 10,
    type: 'effect',
    description: 'Provides a 25% damage boost to all friendly ships for (12, 13, 14) seconds ("W" key to use; 45s cooldown).',
    cooldown: 45000,
    effectIndex: 10,
    image: damageBoostIcon,
    sound: damageBoostSound,
  },
  {
    index: 11,
    type: 'effect',
    description: 'Boosts armor by 4 for (15, 16, 17) seconds',
    cooldown: 55000,
    effectIndex: 7,
    image: armorBoost,
    sound: metalClank,
  },
  {
    index: 12,
    type: 'weapon',
    description: 'Creates an electric field dealing (25, 50, 75) damage per second and slowing enemy units who fly into this field ("W" key to use; 45s cooldown)',
    cooldown: 45000,
    weaponIndex: 5,
    image: electricFieldIcon,
    sound: electricFieldSound,
  },
  {
    index: 13,
    type: 'effect',
    description: 'Reduces the attack damage of all enemy ships by %50 for (11, 12, 13) seconds ("E" key to use; 50s cooldown)',
    cooldown: 50000,
    effectIndex: 2,
    image: damageReductionIcon,
    sound: damageReductionSound,
  },
  {
    index: 14,
    type: 'effect',
    description: 'Reduces the armor of all enemy ships by 3 for (11, 12, 13) seconds ("E" key to use; 45s cooldown)',
    cooldown: 45000,
    effectIndex: 11,
    image: armorReductionIcon,
    sound: armorReductionSound,
  },
  {
    index: 15,
    type: '',
    weaponIndex: 6,
    description: 'Teleports the ship a short distance (200, 400, 600) ("E" key to use; 35s cooldown)',
    cooldown: 35000,
    image: teleportIcon,
    sound: teleportSound,
    animationIndex: 2,
  },
  {
    index: 16,
    type: 'effect',
    description: 'Heals ally units for (%12, %25, %40) of total hitpoints ("E" key to use; 50s cooldown)',
    cooldown: 50000,
    effectIndex: 6,
    image: healingIcon,
    sound: healSound,
  },
  {
    index: 17,
    type: 'weapon',
    weaponIndex: 6,
    description: 'Fires a red meteor dealing (100, 200, 300) damage, slowing and poison your opponent',
    cooldown: 30000,
    image: redMeteorIcon,
    sound: meteorConeSound,
  },
]
