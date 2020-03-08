import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, gong} from '../constants/settings.js';
import {DEFENSES} from '../constants/settings.js';

const handleClick = (updateState, currentPlayer, defenseItemIndex) => {
  const gold = currentPlayer.gold - DEFENSES[defenseItemIndex].price;
  if (defenseItemIndex === 0) {
    if (gold >= 0 && currentPlayer.armor < 5) {
      gong.play();
      updateState({currentPlayer: {...currentPlayer, armor: currentPlayer.armor + 1, gold: gold}});
    } else {
      notEnoughResources.play();
      console.log('Not enough gold');
    }
  } else if (defenseItemIndex === 1) {
    if (gold >= 0) {
      gong.play();
      updateState({currentPlayer: {...currentPlayer, hitpoints: currentPlayer.hitpoints + 200, gold: gold}});
    } else {
      notEnoughResources.play();
      console.log('Not enough gold');
    }
  } else {

  }
};

export const Defense = ({updateState, imageSrc, currentPlayer, defenseItem}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(updateState, currentPlayer, defenseItem.index)}>
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
