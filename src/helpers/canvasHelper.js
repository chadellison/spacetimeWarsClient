export const drawShip = (ctx, player, fighterShip, thrusterAudio) => {
  const {x, y} = player.location;
  ctx.save();
  const cx = x + 0.5 * fighterShip.width;
  const cy = y + 0.5 * fighterShip.height;

  ctx.translate(cx, cy);
  ctx.rotate((Math.PI / 180) * player.angle);
  ctx.translate(-cx, -cy);

  ctx.drawImage(fighterShip, x, y)

  if (player.isAccelerating) {
    thrusterAudio.play()
    ctx.beginPath();
    ctx.moveTo(player.location.x - 8, player.location.y + 4 + fighterShip.height / 2);
    ctx.lineTo(player.location.x - 8, player.location.y - 2 + fighterShip.height / 2);
    ctx.lineTo(player.location.x, player.location.y - 4 + fighterShip.height / 2);
    ctx.lineTo(player.location.x, player.location.y + 5 + fighterShip.height / 2);

    let grd = ctx.createLinearGradient(
      player.location.x - 8,
      player.location.y - 5 + fighterShip.height / 2,
      player.location.x,
      player.location.y + 6 + fighterShip.height / 2
    );
    grd.addColorStop(0, "#5c93e6");
    grd.addColorStop(1, "#f0f6ff");

    ctx.stroke();
    ctx.fillStyle = grd;
    ctx.fill();
  } else {
    thrusterAudio.pause();
  }
  ctx.restore()
}
