import React from 'react';
import '../styles/headerButton.css';

export const HeaderButton = ({buttonText, updateState}) => {
  return (
    <div className="headerButton"
      onClick={() => updateState({modal: buttonText})}>
      {buttonText}
    </div>
  );
};
