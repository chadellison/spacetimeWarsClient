import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/settings.js';

const handleClick = (updateState, shipIndex, waitingPlayer) => {
  const gold = waitingPlayer.gold - SHIPS[shipIndex].price;

  if (gold >= 0) {
    gong.play();
    updateState({waitingPlayer: {...waitingPlayer, shipIndex, gold}});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({updateState, imageSrc, waitingPlayer, ship}) => {
  return (
    <div className={`selection ${waitingPlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(updateState, ship.index, waitingPlayer)}>
        <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionData">
          {`${ship.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${ship.price}`}
        </div>
        <div className="selectionData">
          {`Hitpoints: ${ship.hitpoints}`}
        </div>
        <div className="selectionData">
          {`Armor: ${ship.armor}`}
        </div>
        <div className="selectionData">
          {`Speed: ${ship.speed}`}
        </div>
    </div>
  );
};
