import React from 'react';
import '../styles/gameButton.css';

export const GameButton = ({handleShopButton, buttonText}) => {
  return (
    <div className="gameButton" onClick={handleShopButton}>{buttonText}</div>
  );
};
