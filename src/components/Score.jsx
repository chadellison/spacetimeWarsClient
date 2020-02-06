import React from 'react';

const Score = (player) => {
  return (
    <div>
      <span>{player.name}</span>
      <span>&nbsp;&nbsp;{player.score} pts.</span>
    </div>
  );
};

export default Score;
