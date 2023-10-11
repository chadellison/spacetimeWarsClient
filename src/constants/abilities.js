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
  backupSound,
  homingSound,
  crippleSound,
  poisonDartSound,
  gasBombProjectileSound,
  electricFieldProjectileSound,
} from '../constants/settings.js';

import nuclearExplosionIcon from '../images/nuclearExplosionIcon.png';
import warpSpeedIcon from '../images/warpSpeedIcon2.png';
import mineIcon from '../images/mineIcon2.png';
import stunGunIcon from '../images/stunGunIcon2.png';
import invulnerabilityIcon from '../images/invulnerableIcon2.png';
import stealthModeIcon from '../images/stealthMode.png';
import meteorShowerIcon from '../images/meteorShowerIcon2.png';
import healingIcon from '../images/healthBoost2.png';
import piercerIcon from '../images/piercerIcon2.png';
import rapidFireIcon from '../images/rapidFireIcon2.png';
import damageBoostIcon from '../images/damageBoostIcon.png';
import disableIcon from '../images/disableIcon.png';
import immolationIcon from '../images/immolationIcon.png';
import armorReductionIcon from '../images/armorReductionIcon3.png';
import redMeteorIcon from '../images/redMeteorIcon2.png';
import teleportIcon from '../images/teleportIcon2.png';
import armorBoost from '../images/armorBoost2.png';
import homingAttackIcon from '../images/homingAttackIcon.png';
import backupIcon from '../images/backupIcon.png';
import crippleIcon from '../images/crippleIcon.png';
import poisonDartIcon from '../images/poisonDartIcon2.png';
import massStunIcon from '../images/massStunIcon2.png';
import poisonIcon from '../images/poisonIcon2.png';

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
    description: 'Deploys a nuclear blast dealing (700, 1400, 2100) damage to every opponent within range 700 ("Q" key to use; 60s cooldown).',
    cooldown: 50000,
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
    description: 'Surrounds the ship with a shield boosting its armor by 4 for (15, 16, 17) seconds',
    cooldown: 55000,
    effectIndex: 7,
    image: armorBoost,
    sound: metalClank,
  },
  {
    index: 12,
    type: 'weapon',
    description: 'Surrounds the ship with hot energy inflicting grevious damage on nearby ships (25, 50, 75) damage per second and slowing enemy units ("W" key to use; 45s cooldown)',
    cooldown: 45000,
    weaponIndex: 5,
    image: immolationIcon,
    sound: electricFieldSound,
  },
  {
    index: 13,
    type: 'effect',
    description: 'Disables your opponent\'s weapons systems for (3, 6, 9) seconds ("E" key to use; 50s cooldown)',
    cooldown: 50000,
    effectIndex: 2,
    image: disableIcon,
    sound: damageReductionSound,
  },
  {
    index: 14,
    type: 'effect',
    description: 'Reduces the armor of all enemy ships by 3 for (8, 16, 24) seconds respectively ("E" key to use; 50s cooldown)',
    cooldown: 45000,
    effectIndex: 11,
    image: armorReductionIcon,
    sound: armorReductionSound,
  },
  {
    index: 15,
    type: 'other',
    weaponIndex: 6,
    description: 'Teleports the ship a short distance (300, 600, 800) ("E" key to use; 35s cooldown)',
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
  {
    index: 18,
    type: 'other',
    description: 'Calls for reinforcements adding (1, 2, 3) ally ship(s) respectively',
    cooldown: 45000,
    image: backupIcon,
    sound: backupSound,
  },
  {
    index: 19,
    type: 'effect',
    description: 'Homing attack that allows the weapons to always find their targets for (8, 16, 24) seconds respectively',
    cooldown: 30000,
    effectIndex: 13,
    image: homingAttackIcon,
    sound: homingSound,
  },
  {
    index: 20,
    type: 'effect',
    description: 'Criples opponents for (4, 8, 12) seconds reducing their movement speed, and attack speed',
    cooldown: 50000,
    effectIndex: 14,
    image: crippleIcon,
    sound: crippleSound,
  },
  {
    index: 21,
    type: 'weapon',
    description: 'Fires a poison projectile that poisons the nearest target (initial damage of 800, 1600, 2400 respectively + poison damage).',
    cooldown: 30000,
    weaponIndex: 7,
    image: poisonDartIcon,
    sound: poisonDartSound,
  },
  {
    index: 22,
    type: 'weapon',
    weaponIndex: 8,
    description: 'Stuns all enemy ships within 400 radius for (3, 6, 9) seconds respectively',
    cooldown: 25000,
    effectIndex: 3,
    image: massStunIcon,
    sound: electricFieldProjectileSound,
  },
  {
    index: 23,
    type: 'weapon',
    weaponIndex: 9,
    description: 'poisons all enemy ships within a 400 radius for (3, 6, 9) seconds respectively',
    cooldown: 25000,
    effectIndex: 0,
    image: poisonIcon,
    sound: gasBombProjectileSound,
  }
];
