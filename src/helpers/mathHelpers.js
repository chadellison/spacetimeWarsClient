export const round = (value) => {
  return ~~ (value + 0.5)
}

export const calculateAngle = (part, whole) => {
  const value = Math.round(part * 360 / whole)
  return value > 0 ? value : 0;
};
