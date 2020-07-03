import {
  SPRITE_WIDTH,
  SPRITE_ROW_COUNT,
  SPRITE_COLUMN_COUNT,
} from '../constants/settings.js';

export const updateFrame = (animation) => {
  if (animation.rate === 0) {
    if (animation.coordinates.x >= animation.width * (animation.rowCount - 1) && animation.coordinates.y >= animation.height * (animation.columnCount - 1)) {
      animation.coordinates = {x: 0, y: 0}
    } else if (animation.coordinates.x >= animation.width * (animation.rowCount - 1)) {
      animation.coordinates.x = 0
      animation.coordinates.y += animation.height
    } else {
      animation.coordinates.x += animation.width
    }
    animation.rate = animation.startRate
  } else {
    animation.rate -= 1
  }
}

export const handleExplodeUpdate = (isExploding, explodeAnimation) => {
  if (isExploding) {
    if (explodeAnimation.x < (SPRITE_WIDTH * SPRITE_ROW_COUNT)) {
      explodeAnimation.x += SPRITE_WIDTH;
    } else if (explodeAnimation.x === (SPRITE_WIDTH * SPRITE_ROW_COUNT) && explodeAnimation.y < (SPRITE_WIDTH * SPRITE_COLUMN_COUNT)) {
      explodeAnimation.x = 0;
      explodeAnimation.y += SPRITE_WIDTH;
    } else {
      explodeAnimation = 'complete';
    }
    return explodeAnimation;
  } else {
    return {};
  }
}
