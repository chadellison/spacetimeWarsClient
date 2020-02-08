import {VELOCITY} from '../constants/settings.js';

export const handleDirection = (player) => {
  if (player.direction === 'left') {
    player.location.x -= VELOCITY;
  }
  if (player.direction === 'right') {
    player.location.x += VELOCITY;
  }
  if (player.direction === 'up') {
    player.location.y -= VELOCITY;
  }
  if (player.direction === 'down') {
    player.location.y += VELOCITY;
  }
}

export const handleMouthOpenAngle = (player) => {
  if (player.mouthOpenValue <= 0) {
    player.mouthPosition = 1;
  } else if (player.mouthOpenValue >= 40) {
    player.mouthPosition = -1;
  }

  player.mouthOpenValue += (8 * player.mouthPosition);
}

export const handleWrap = (player, width, height) => {
  if (player.location.x >= width) {
    player.location.x = 1;
  }

  if (player.location.x <= 0) {
    player.location.x = width;
  }

  if (player.location.y >= height) {
    player.location.y = 1;
  }

  if (player.location.y <= 0) {
    player.location.y = height;
  }
}
