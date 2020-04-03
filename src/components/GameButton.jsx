import React from 'react';
import '../styles/gameButton.css';

export const GameButton = ({onClick, buttonText, className}) => {
  return (
    <div className={className} onClick={onClick}>{buttonText}</div>
  );
};
