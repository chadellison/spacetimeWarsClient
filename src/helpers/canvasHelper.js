import {
  SQUARE_DISTANCE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../constants/settings.js';

export const drawShip = (ctx, player, fighterShip) => {
  // ctx.beginPath();
  const {x, y} = player.location;
  const {direction} = player;
  // if (direction === 'right') {
  //   ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * player.mouthOpenValue, (Math.PI / 180) * (360 - player.mouthOpenValue));
  // } else if (direction === 'left') {
  //   ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (179 - player.mouthOpenValue), (Math.PI / 180) * (180 + player.mouthOpenValue), true);
  // } else if (direction === 'up') {
  //   ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (269 - player.mouthOpenValue), (Math.PI / 180) * (270 + player.mouthOpenValue), true);
  // } else if (direction === 'down') {
  //   ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (89 - player.mouthOpenValue), (Math.PI / 180) * (90 + player.mouthOpenValue), true);
  // }

  // const TO_RADIANS = Math.PI/180;
  // ctx.translate(x, y);
  // ctx.rotate(30 * TO_RADIANS);
  // ctx.drawImage(fighterShip, -(fighterShip.width / 2), -(fighterShip.height / 2));
  // ctx.restore();


  // ctx.setTransform(1, 0, 0, 1, 10, 10); // sets scale and origin
  // ctx.rotate(player.rotation);
  // console.log(x, y)
  // ctx.drawImage(fighterShip, x, y);
  // ctx.restore();

  const cx = x + 0.5 * fighterShip.width;  // x of shape center
  const cy = y + 0.5 * fighterShip.height;  // y of shape center

  ctx.translate(cx, cy);              //translate to center of shape
  ctx.rotate((Math.PI / 180) * player.rotation);  //rotate 25 degrees.
  ctx.translate(-cx, -cy);            //translate center back to 0,0

  ctx.drawImage(fighterShip, x, y)
  // ctx.restore();


  // ctx.lineTo(x, y);
  // ctx.fillStyle = '#FF0';
  // ctx.fill();
}

export const drawBoard = (ctx, board) => {
  Object.keys(board).forEach((square) => {
    if (board[square] === 1) {
      const coordinates = square.split(':')
      ctx.beginPath();
      ctx.rect(coordinates[0], coordinates[1], 5, 5);
      ctx.fillStyle = '#e8da5a';
      ctx.fill();
    };
  });
};

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
