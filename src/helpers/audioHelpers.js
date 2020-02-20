import thrusterAudio from '../audio/thruster.mov';

export const thruster = () => {
  let thruster = new Audio(thrusterAudio);
  thruster.loop = true;

  return thruster;
}
