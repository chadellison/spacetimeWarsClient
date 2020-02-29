export const drawShip = (context, player, ship) => {
  handleDirection(context, ship, player.location, player.angle)
  if (player.accelerate) {
    handleAcceleration(context, player, ship);
  }

  context.restore();
}

export const handleDirection = (context, image, location, trajectory) => {
  const {x, y} = location;
  context.save();
  const cx = x + 0.5 * image.width;
  const cy = y + 0.5 * image.height;

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * trajectory);
  context.translate(-cx, -cy);
  context.drawImage(image, x, y);
}

const handleAcceleration = (context, player, ship) => {
  context.beginPath();
  context.moveTo(player.location.x - 8, player.location.y + 4 + ship.height / 2);
  context.lineTo(player.location.x - 8, player.location.y - 2 + ship.height / 2);
  context.lineTo(player.location.x, player.location.y - 4 + ship.height / 2);
  context.lineTo(player.location.x, player.location.y + 5 + ship.height / 2);

  let grd = context.createLinearGradient(
    player.location.x - 8,
    player.location.y - 5 + ship.height / 2,
    player.location.x,
    player.location.y + 6 + ship.height / 2
  );
  grd.addColorStop(0, "#5c93e6");
  grd.addColorStop(1, "#f0f6ff");

  context.stroke();
  context.fillStyle = grd;
  context.fill();
}
