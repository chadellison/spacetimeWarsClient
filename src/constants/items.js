// items
import armorBoost from '../images/armorBoost2.png';
import healthBoost from '../images/healthBoost2.png';
import stun from '../images/stun2.png';
import absorbDamage from '../images/absorbDamage.png';
import improvedThrusters from '../images/improvedThrusters.png';
import resistance from '../images/resistance.png';
import antidote from '../images/antidote.png';
import increasedAttackSpeed from '../images/increasedAttackSpeedIcon.png';
import repairBots from '../images/repairGears.png';
import stealthMode from '../images/stealthMode.png';
import damageIncrease from '../images/damageIncrease.png';
import healthIncrease from '../images/healthIncrease.png';
import evasion from '../images/evasion.png';
import returnDamage from '../images/returnDamage.png';
import reinforcedArmor from '../images/reinforcedArmor2.png';
import agilityIcon from '../images/agilityIcon.png'

export const ITEMS = [
  {
    id: 1,
    index: 0,
    price: 1200,
    name: 'Health boost',
    image: healthBoost,
    effectIndex: 6,
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
    effectIndex: 4,
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
    effectIndex: 15,
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
    effectIndex: 7,
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
    effectIndex: 3,
    cooldown: 0,
    durationCount: 0,
    description: 'Provieds your weapon a 10% chance to stun your opponent for two seconds'
  },
  {
    id: 7,
    index: 6,
    price: 2000,
    name: 'Damage Boost',
    effectIndex: 10,
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
    price: 600,
    name: 'Improved Thrusters',
    image: improvedThrusters,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases ship\'s speed by 2',
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
    name: 'Antedote',
    image: antidote,
    cooldown: 0,
    durationCount: 0,
    description: 'Nullifies poison damage',
  },
  {
    id: 14,
    index: 13,
    price: 825,
    name: 'Increased attack speed',
    image: increasedAttackSpeed,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases your ship\'s attack speed by %20',
  },
  {
    id: 15,
    index: 14,
    price: 625,
    name: 'Reinforced armor',
    image: reinforcedArmor,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases your ship\'s armor by 2',
  },
  {
    id: 16,
    index: 15,
    price: 715,
    name: 'Agility',
    image: agilityIcon,
    cooldown: 0,
    durationCount: 0,
    description: 'Increases your ship\'s agility by 25%',
  }
];
