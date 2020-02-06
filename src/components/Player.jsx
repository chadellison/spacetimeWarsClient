import React from 'react';

const checkTunnel = (x, y, dir, xMax, updatePlayerCoordinates) => {
  // let xMax = window.appState.board[0].length - 1

  if (x === 0 && dir === 'left') {
    // window.appState.player.x = xMax
    updatePlayerCoordinates(xMax, y)
  }

  if (x === (xMax) && dir === 'right') {
    // window.appState.player.x = 0
    updatePlayerCoordinates(0, y)
  }
}

const checkCollision = (x, y, direction, board) => {
  let value = null

  if (direction === 'right') value = board[y][x + 1]
  if (direction === 'left') value = board[y][x - 1]
  if (direction === 'bottom') value = board[y + 1][x]
  if (direction === 'top') value = board[y - 1][x]
  return value;
};

const Player = ({player, board, updatePlayerCoordinates, updatePlayerScore, updateBoard}) => {
  let direction = player.direction
  let x = player.x
  let y = player.y
  let styles = {}

  let collisionVal = checkCollision(x, y, direction, board)
collisionVal = 1
  if (collisionVal !== 1) {
    if (direction === 'right' && x < 27) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < 30) y += 1
    if (direction === 'top' && y > 0) y -= 1

    updatePlayerCoordinates(x, y)

    if (collisionVal === 2) {
      updatePlayerScore(player.score + 1)
      updateBoard(x, y, 0)
    };
  };

  var xPercent = x * 100 / 28
  var yPercent = y * 100 / 31

  styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all 200ms linear'
  }

  checkTunnel(x, y, direction, board[0].length - 1)

  if (x <= 0 || x >= 27) styles.display = 'none'

  return (
    <div className='player' style={styles}>
    </div>
  );
};

export default Player;
