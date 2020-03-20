// items
import repairBots from '../images/repairGears.png';
import healthBoost from '../images/healthBoost.jpg';

export const ITEMS = [
  {
    id: 1,
    index: 0,
    price: 700,
    name: 'Health boost',
    image: healthBoost,
    lastUpdated: 0,
    description: 'Boosts hitpoints to %50 of max hitpoints when hitpoints drop below %25 (120 second cooldown)'
  },
  {
    id: 2,
    index: 1,
    price: 300,
    name: 'Repair bots',
    image: repairBots,
    lastUpdated: 0,
    description: 'Repairs 1% of total hitpoints every second'
  }
];
