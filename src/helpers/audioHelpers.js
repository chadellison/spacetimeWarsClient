import thrusterAudio from '../audio/thruster.mov';
import cannonAudio from '../audio/cannon.wav';

const thruster = new Audio(thrusterAudio);
thruster.loop = true;

const cannon = new Audio(cannonAudio);

export const handleAudio = (player) => {
  if (player.accelerate) {
    thruster.currentTime = 0
    const playPromise = thruster.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {thruster.play()})
    }
  } else {
    const pausePromise = thruster.pause();
    if (pausePromise !== undefined) {
      pausePromise.catch(() => {thruster.pause()})
    }
  }

  if (player.fire) {
    cannon.currentTime = 0
    const cannonPromise = cannon.play();
    if (cannonPromise !== undefined) {
      cannonPromise.catch(() => {
        cannonPromise.play()
      });
    }
  }
}
