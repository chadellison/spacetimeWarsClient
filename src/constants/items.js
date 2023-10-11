import { API_RESOURCE_URL } from '../api/apiHelpers.js';
// items
import armorBoost from '../images/armorBoost2.png';
import healthBoost from '../images/healthBoost2.png';
import stun from '../images/stun2.png';
import absorbDamage from '../images/absorbDamage.png';
import improvedThrusters from '../images/improvedThrusters.png';
import resistance from '../images/resistance.png';
import antidote from '../images/antidote.png';

const repairBots = `${API_RESOURCE_URL}/repairGears`;
const stealthMode = `${API_RESOURCE_URL}/stealthMode`;
const damageIncrease = `${API_RESOURCE_URL}/damageIncrease`;
const healthIncrease = `${API_RESOURCE_URL}/healthIncrease`;
const evasion = `${API_RESOURCE_URL}/evasion`;
const returnDamage = `${API_RESOURCE_URL}/returnDamage`;

export const ITEMS = [
  {
    id: 1,
    index: 0,
    price: 1200,
    name: 'Health boost',
    image: healthBoost,
    cooldown: 120000,
    durationCount: 120000,
    description: 'Boosts hitpoints to %50 of max hitpoints when hitpoints drop below %25 (120 second cooldown)'
  },
  {
    id: 2,
    index: 1,
    price: 300,
    name: 'Repair bots',
    image: repairBots,
    cooldown: 1000,
    durationCount: 1000,
    description: 'Repairs 1% of total hitpoints every second'
  },
  {
    id: 3,
    index: 2,
    price: 650,
    name: 'Stealth Mode',
    image: stealthMode,
    cooldown: 120000,
    durationCount: 120000,
    description: 'Renders your ship invisible for six seconds to other players when your hitpoints drop below 25% (120 second cooldown)'
  },
  {
    id: 4,
    index: 3,
    price: 725,
    name: 'Absorb damage',
    image: absorbDamage,
    cooldown: 10000,
    durationCount: 10000,
    description: 'Provieds a shield that completely absorbs one hit -- negating all damage/effects from it-- every 10 seconds.'
  },
  {
    id: 5,
    index: 4,
    price: 750,
    name: 'Armor Boost',
    image: armorBoost,
    cooldown: 20000,
    durationCount: 15000,
    description: 'Adds 4 armor to player for 15 seconds when hitpoints drop below 33%. 20 second cooldown.'
  },
  {
    id: 6,
    index: 5,
    price: 1100,
    name: 'Stun Attack',
    image: stun,
    cooldown: 0,
    durationCount: 0,
    description: 'Provieds your weapon a 10% chance to stun your opponent for two seconds'
  },
  {
    id: 7,
    index: 6,
    price: 2000,
    name: 'Damage Boost',
    image: damageIncrease,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases your ship\'s attack damage by %80 for all weapons and abilities'
  },
  {
    id: 8,
    index: 7,
    price: 1600,
    name: 'Hitpoint Increase',
    image: healthIncrease,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases your ship\'s hitpoints by 1200',
  },
  {
    id: 9,
    index: 8,
    price: 800,
    name: 'Evade Attack',
    image: evasion,
    cooldown: 0,
    durationCount: 0,
    description: 'Allows your ship to evade attacks 25% of the time',
  },
  {
    id: 10,
    index: 9,
    price: 1100,
    name: 'Return Damage',
    image: returnDamage,
    cooldown: 0,
    durationCount: 0,
    description: 'Your ship will return 30% of damage dealt to it',
  },
  {
    id: 11,
    index: 10,
    price: 800,
    name: 'Improved Thrusters',
    image: improvedThrusters,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases ship\'s speed by 3',
  },
  {
    id: 12,
    index: 11,
    price: 650,
    name: 'Resistance',
    image: resistance,
    cooldown: 0,
    durationCount: 0,
    description: 'Reduces the duration of negative buffs by 50%',
  },
  {
    id: 13,
    index: 12,
    price: 450,
    name: 'antedote',
    image: antidote,
    cooldown: 0,
    durationCount: 0,
    description: 'Nullifies poison damage',
  }
];
