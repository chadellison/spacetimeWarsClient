import React from 'react';
import '../styles/ship.css';
import {notEnoughResources} from '../constants/settings.js';

const handleClick = () => {
  console.log('clicked armor')
};

export const Defense = ({updateState, imageSrc, waitingPlayer, defenseItem}) => {
  return (
    <div className="selection"
      onClick={() => handleClick()}>
        <img id={defenseItem.index} src={imageSrc} alt="item" className="selectionImage"/>
        <div className="selectionData">
          {`${defenseItem.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${defenseItem.price}`}
        </div>
        <div className="selectionData">
          {`Description: ${defenseItem.description}`}
        </div>
    </div>
  );
};
