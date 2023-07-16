export const round = (value) => {
  return Math.round(value);
  // return ~~ (value + 0.5)
}

export const calculateAngle = (part, whole) => {
  const value = Math.round(part * 360 / whole)
  return value > 0 ? value : 0;
};

export const angleFromCoordinates = (start, end) => {
  var dy = end.y - start.y;
  var dx = end.x - start.x;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return round(theta);
}