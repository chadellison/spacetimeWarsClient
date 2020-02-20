export const drawShip = (context, player, fighterShip) => {
  const {x, y} = player.location;
  context.save();
  const cx = x + 0.5 * fighterShip.width;
  const cy = y + 0.5 * fighterShip.height;

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * player.angle);
  context.translate(-cx, -cy);

  context.drawImage(fighterShip, x, y)

  if (player.isAccelerating) {
    handleAcceleration(context, player, fighterShip)
  }
  context.restore()
}

const handleAcceleration = (context, player, fighterShip) => {
  context.beginPath();
  context.moveTo(player.location.x - 8, player.location.y + 4 + fighterShip.height / 2);
  context.lineTo(player.location.x - 8, player.location.y - 2 + fighterShip.height / 2);
  context.lineTo(player.location.x, player.location.y - 4 + fighterShip.height / 2);
  context.lineTo(player.location.x, player.location.y + 5 + fighterShip.height / 2);

  let grd = context.createLinearGradient(
    player.location.x - 8,
    player.location.y - 5 + fighterShip.height / 2,
    player.location.x,
    player.location.y + 6 + fighterShip.height / 2
  );
  grd.addColorStop(0, "#5c93e6");
  grd.addColorStop(1, "#f0f6ff");

  context.stroke();
  context.fillStyle = grd;
  context.fill();
}

export const drawWeapon = (context, weapon, fighterShip) => {
  context.fillStyle = 'green';
  const x = weapon.location.x + 0.5 * fighterShip.width;
  const y = weapon.location.y + 0.5 * fighterShip.height;
  context.fillRect(x, y, 5, 5);
}
