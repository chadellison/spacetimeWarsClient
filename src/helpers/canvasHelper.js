import {
  SQUARE_DISTANCE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PACMAN_RADIUS
} from '../constants/settings.js';

export const drawPacman = (ctx, player) => {
  ctx.beginPath();
  const {x, y} = player.location;
  const {direction} = player;
  if (direction === 'right') {
    ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * player.mouthOpenValue, (Math.PI / 180) * (360 - player.mouthOpenValue));
  } else if (direction === 'left') {
    ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (179 - player.mouthOpenValue), (Math.PI / 180) * (180 + player.mouthOpenValue), true);
  } else if (direction === 'up') {
    ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (269 - player.mouthOpenValue), (Math.PI / 180) * (270 + player.mouthOpenValue), true);
  } else if (direction === 'down') {
    ctx.arc(x, y, PACMAN_RADIUS, (Math.PI / 180) * (89 - player.mouthOpenValue), (Math.PI / 180) * (90 + player.mouthOpenValue), true);
  }

  ctx.lineTo(x, y);
  ctx.fillStyle = '#FF0';
  ctx.fill();
}

export const drawBoard = (ctx, board) => {
  Object.keys(board).forEach((square) => {
    if (board[square] === 1) {
      const coordinates = square.split(':')
      ctx.beginPath();
      ctx.rect(coordinates[0], coordinates[1], 5, 5);
      ctx.fillStyle = '#e8da5a';
      ctx.fill();
    }
  });
};

export const newBoard = () => {
  let x = SQUARE_DISTANCE;
  let y = SQUARE_DISTANCE;
  let board = {};
  while (y <= BOARD_HEIGHT) {
    while (x <= BOARD_WIDTH) {
      board[x + ':' + y] = 1
      x += SQUARE_DISTANCE;
    };
    board[x + ':' + y] = 1
    x = SQUARE_DISTANCE;
    y += SQUARE_DISTANCE;
  };
  return board;
};
