import {
  SQUARE_DISTANCE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  VELOCITY
} from '../constants/settings.js';

export const drawShip = (ctx, player, fighterShip) => {
  const {x, y} = player.location;
  console.log('location', player.location)
  console.log('angle', player.angle)

  const cx = x + 0.5 * fighterShip.width;  // x of shape center
  const cy = y + 0.5 * fighterShip.height;  // y of shape center

  ctx.translate(cx, cy);              //translate to center of shape
  ctx.rotate((Math.PI / 180) * player.angle);
  ctx.translate(-cx, -cy);            //translate center back to 0,0

  ctx.drawImage(fighterShip, x, y)
}

export const animatePlayer = (player) => {
  switch (player.lastEvent) {
    case 'left':
      player.angle -= 0.1;
      break;
    case 'right':
      player.angle += 0.1;
      break;
    case 'up':
      const slope = Math.tan(player.angle * Math.PI / 180)
      player.location.y -= (slope * VELOCITY);
      player.location.x += VELOCITY;
      break;
    default:
      break;
  }
};

// export const drawBoard = (ctx, board) => {
//   Object.keys(board).forEach((square) => {
//     if (board[square] === 1) {
//       const coordinates = square.split(':')
//       ctx.beginPath();
//       ctx.rect(coordinates[0], coordinates[1], 5, 5);
//       ctx.fillStyle = '#e8da5a';
//       ctx.fill();
//     };
//   });
// };

// export const newBoard = () => {
//   let x = SQUARE_DISTANCE;
//   let y = SQUARE_DISTANCE;
//   let board = {};
//   while (y <= BOARD_HEIGHT) {
//     while (x <= BOARD_WIDTH) {
//       board[x + ':' + y] = 1
//       x += SQUARE_DISTANCE;
//     };
//     board[x + ':' + y] = 1
//     x = SQUARE_DISTANCE;
//     y += SQUARE_DISTANCE;
//   };
//   return board;
// };
