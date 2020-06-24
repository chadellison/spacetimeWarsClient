import stunAnimation from '../images/stunAnimation.png'
import {Animation} from '../helpers/animation.js';

export const GAME_EFFECTS = [
  {
    id: 1,
    name: 'poison',
    duration: 4000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(7, 151, 24, 0.37)'
  },
  {
    id: 2,
    name: 'slow',
    duration: 9000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(142, 194, 215, 0.54)'
  },
  {
    id: 3,
    name: 'gold steal',
    duration: 3000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(151, 127, 7, 0.37)'
  },
  {
    id: 4,
    name: 'stun',
    duration: 3000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(3, 2, 29, 0.62)'
  },
  {
    id: 5,
    name: 'invisible',
    duration: 11000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(151, 7, 7, 0.37)'

  },
  {
    id: 6,
    name: 'invulnerable',
    duration: 7000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(144, 7, 151, 0.37)'
  },
  {
    id: 7,
    name: 'heal',
    duration: 4000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(19, 20, 22, 0.45)'
  },
  {
    id: 8,
    name: 'armorBoost',
    duration: 15000,
    durationCount: 0,
    animation: new Animation(stunAnimation, 250, 223, 100, 4, 3, 1),
    color: 'rgba(7, 33, 151, 0.37)'
  }
]
