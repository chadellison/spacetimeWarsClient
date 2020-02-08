export const draw = (ctx, player) => {
  ctx.beginPath();
  const x = player.location.x;
  const y = player.location.y;
  const radius = 25;
  if (player.direction === 'right') {
    ctx.arc(x, y, radius, (Math.PI / 180) * player.mouthOpenValue, (Math.PI / 180) * (360 - player.mouthOpenValue));
  } else if (player.direction === 'left') {
    ctx.arc(x, y, radius, (Math.PI / 180) * (179 - player.mouthOpenValue), (Math.PI / 180) * (180 + player.mouthOpenValue), true);
  } else if (player.direction === 'up') {
    ctx.arc(x, y, radius, (Math.PI / 180) * (269 - player.mouthOpenValue), (Math.PI / 180) * (270 + player.mouthOpenValue), true);
  } else if (player.direction === 'down') {
    ctx.arc(x, y, radius, (Math.PI / 180) * (89 - player.mouthOpenValue), (Math.PI / 180) * (90 + player.mouthOpenValue), true);
  }

  ctx.lineTo(player.location.x, player.location.y);
  ctx.fillStyle = '#FF0';
  ctx.fill();
}
