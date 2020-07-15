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

export const updateAnimation = (animation) => {
  if (animation.coordinates.x >= animation.width * (animation.rowCount - 1) && animation.coordinates.y >= animation.height * (animation.columnCount - 1)) {
    animation = 'complete'
  } else if (animation.coordinates.x >= animation.width * (animation.rowCount - 1)) {
    animation.coordinates.x = 0
    animation.coordinates.y += animation.height
  } else {
    animation.coordinates.x += animation.width
  }
  return animation;
}
