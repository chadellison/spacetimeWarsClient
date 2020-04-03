import React from 'react';
import '../styles/headerButtons.css';
import {GameButton} from './GameButton';

export const HeaderButtons = ({updateState}) => {
  return (
    <div className="headerButtons">
      <GameButton
        buttonText={'instructions'}
        onClick={() => updateState({modal: 'instructions'})}
        className="headerButton"
      />
      <GameButton
        buttonText={'credits'}
        onClick={() => updateState({modal: 'credits'})}
        className="headerButton"
      />
    </div>
  );
};
