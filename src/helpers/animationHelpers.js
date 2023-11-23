const endX = (animation) => animation.coordinates.x >= animation.width * (animation.rowCount - 1);
const endY = (animation) => animation.coordinates.y >= animation.height * (animation.columnCount - 1);

export const updateFrame = (animation) => {
  if (endX(animation) && endY(animation)) {
    animation.coordinates = { x: 0, y: 0 }
  } else if (endX(animation)) {
    animation.coordinates.x = 0;
    animation.coordinates.y += animation.height
  } else {
    animation.coordinates.x += animation.width
  }
};

export const updateAnimation = (animation) => {
  if (endX(animation) && endY(animation)) {
    animation.complete = true
  } else if (endX(animation)) {
    animation.coordinates.x = 0
    animation.coordinates.y += animation.height
  } else {
    animation.coordinates.x += animation.width
  }
  return animation;
}
