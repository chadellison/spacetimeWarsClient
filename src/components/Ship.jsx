import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/settings.js';

const handleClick = (updateState, shipIndex, currentPlayer) => {
  const gold = currentPlayer.gold - SHIPS[shipIndex].price;

  if (gold >= 0) {
    gong.play();
    updateState({currentPlayer: {...currentPlayer, shipIndex, gold}});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({updateState, imageSrc, currentPlayer, ship}) => {
  return (
    <div className={`selection ${currentPlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(updateState, ship.index, currentPlayer)}>
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
