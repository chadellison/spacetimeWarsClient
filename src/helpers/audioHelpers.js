
export const playSound = (sound) => {
  sound.currentTime = 0
  const playPromise = sound.play();
  if (playPromise !== undefined) {
    playPromise.catch((e) => console.log(e));
  }
}

export const stopSound = (sound) => {
  const pausePromise = sound.pause();
  if (pausePromise !== undefined) {
    pausePromise.catch((e) => console.log(e));
  }
}
