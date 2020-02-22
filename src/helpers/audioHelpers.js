import thrusterAudio from '../audio/thruster.mov';
import cannonAudio from '../audio/cannon.wav';

const thruster = new Audio(thrusterAudio);
thruster.loop = true;

const cannon = new Audio(cannonAudio);

export const handleAudio = (player) => {
  if (player.accelerate) {
    thruster.currentTime = 0
    thruster.play();
  } else {
    thruster.pause();
  }

  if (player.fire) {
    cannon.currentTime = 0
    cannon.play();
  }
}
