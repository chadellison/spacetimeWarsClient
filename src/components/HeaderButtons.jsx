import React from 'react';
import '../styles/headerButtons.css';
import {HeaderButton} from './HeaderButton';

export const HeaderButtons = ({updateState}) => {
  return (
    <div className="headerButtons">
      <HeaderButton buttonText={'instructions'} updateState={updateState} />
      <HeaderButton buttonText={'credits'} updateState={updateState} />
    </div>
  );
};
