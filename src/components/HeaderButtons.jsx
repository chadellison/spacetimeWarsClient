import React from 'react';
import '../styles/headerButtons.css';
import { GameButton } from './GameButton';

export const HeaderButtons = ({ updateState, handleLeaderBoard }) => {
  return (
    <div className="headerButtons">
      <GameButton
        buttonText={'credits'}
        onClick={() => updateState({ modal: 'credits' })}
        className="headerButton"
      />
      <GameButton
        buttonText={'leaderboard'}
        onClick={handleLeaderBoard}
        className="headerButton"
      />
    </div>
  );
};
