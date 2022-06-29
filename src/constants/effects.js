import poisonAnimation from '../images/poisonAnimation2.png'
import healAnimation from '../images/healAnimation.png'
import armorBoost from '../images/armorBoostAnimation.png'
import invulnerableAnimation from '../images/invulnerableAnimation.png'
import coldAnimation from '../images/coldAnimation.png'
import stunAnimation from '../images/stunAnimation.png'
import warpSpeedAnimation from '../images/warpSpeedAnimation2.png'
import damageBoostIcon from '../images/damageBoostIcon.png';
import damageReductionAnimation from '../images/damageReductionAnimation.png';
import electricFieldAnimation from '../images/electricFieldAnimation.png'
import armorReductionAnimation from '../images/armorReductionAnimation.png'
import crippleAnimation from '../images/crippleAnimation.png'

export const GAME_EFFECTS = [
  {
    id: 1,
    name: 'poison',
    duration: 4000,
    durationCount: 0,
    color: 'rgba(7, 151, 24, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 0,
      width: 400,
      height: 225,
      renderWidth: 400,
      renderHeight: 225,
      rowCount: 91,
      columnCount: 1,
      rate: 1,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 2,
    name: 'slow',
    duration: 9000,
    durationCount: 0,
    color: 'rgba(142, 194, 215, 0.54)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 1,
      width: 400,
      height: 225,
      renderWidth: 400,
      renderHeight: 225,
      rowCount: 91,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 3,
    name: 'damageReduction',
    duration: 8000,
    durationCount: 0,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 2,
      width: 128,
      height: 128,
      renderWidth: 128,
      renderHeight: 128,
      rowCount: 4,
      columnCount: 4,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 4,
    name: 'stun',
    duration: 3000,
    durationCount: 0,
    color: 'rgba(3, 2, 29, 0.62)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 3,
      width: 400,
      height: 225,
      renderWidth: 400,
      renderHeight: 225,
      rowCount: 40,
      columnCount: 1,
      rate: 0,
      startRate: 1,
      xOffset: 0,
      yOffset: -50,
    }
  },
  {
    id: 5,
    name: 'invisible',
    duration: 8000,
    durationCount: 0,
    color: 'rgba(151, 7, 7, 0.37)',
  },
  {
    id: 6,
    name: 'invulnerable',
    duration: 5000,
    durationCount: 0,
    color: 'rgba(144, 7, 151, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 4,
      width: 400,
      height: 225,
      renderWidth: 400,
      renderHeight: 225,
      rowCount: 105,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 7,
    name: 'heal',
    duration: 4000,
    durationCount: 0,
    color: 'rgba(19, 20, 22, 0.45)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 5,
      width: 128,
      height: 128,
      renderWidth: 100,
      renderHeight: 100,
      rowCount: 4,
      columnCount: 6,
      rate: 1,
      startRate: 1,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 8,
    name: 'armorBoost',
    duration: 15000,
    durationCount: 0,
    color: 'rgba(7, 33, 151, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 6,
      width: 400,
      height: 225,
      renderWidth: 400,
      renderHeight: 225,
      rowCount: 150,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  },
  {
    id: 9,
    name: 'warpSpeed',
    duration: 8000,
    durationCount: 0,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 7,
      width: 200,
      height: 113,
      renderWidth: 200,
      renderHeight: 113,
      rowCount: 24,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 24,
      yOffset: 0,
    }
  },
  {
    id: 10,
    name: 'rapidFire',
    duration: 10000,
    durationCount: 0,
  },
  {
    id: 11,
    name: 'damageBoost',
    duration: 15000,
    durationCount: 0,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 8,
      width: 70,
      height: 70,
      renderWidth: 30,
      renderHeight: 30,
      rowCount: 1,
      columnCount: 1,
      rate: 1,
      startRate: 1,
      xOffset: 25,
      yOffset: -25,
    }
  },
  {
    id: 12,
    name: 'armorReduction',
    duration: 8000,
    durationCount: 0,
    animation: {
      spriteIndex: 9,
      location: {x: 0, y: 0},
      coordinates: {x: 0, y: 0},
      width: 400,
      height: 225,
      renderWidth: 300,
      renderHeight: 168,
      rowCount: 141,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    id: 13,
    name: 'zapped',
    duration: 0,
    durationCount: 0,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 10,
      width: 256,
      height: 256,
      renderWidth: 192,
      renderHeight: 192,
      rowCount: 4,
      columnCount: 7,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0
    }
  },
  {
    id: 14,
    name: 'homingAttack',
    duration: 8000,
    durationCount: 0,
  },
  {
    id: 15,
    name: 'cripple',
    duration: 4000,
    durationCount: 0,
    animation: {
      coordinates: {x: 0, y: 0},
      spriteIndex: 11,
      width: 300,
      height: 169,
      renderWidth: 300,
      renderHeight: 169,
      rowCount: 210,
      columnCount: 1,
      rate: 0,
      startRate: 0,
      xOffset: 0,
      yOffset: 0,
    }
  }
]
export const SPRITE_IMAGES = [
  poisonAnimation,
  coldAnimation,
  damageReductionAnimation,
  stunAnimation,
  invulnerableAnimation,
  healAnimation,
  armorBoost,
  warpSpeedAnimation,
  damageBoostIcon,
  armorReductionAnimation,
  electricFieldAnimation,
  crippleAnimation
]
