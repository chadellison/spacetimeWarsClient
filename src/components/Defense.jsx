import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, gong} from '../constants/settings.js';
import {DEFENSES} from '../constants/settings.js';

const handleClick = (updateState, currentPlayer, defenseItem) => {
  const gold = currentPlayer.gold - DEFENSES[defenseItem.index].price;
  let player;
  if (gold >= 0) {
    if (defenseItem.index === 0 && currentPlayer.armor < 5) {
      player = {
        ...currentPlayer,
        hitpoints: currentPlayer.maxHitpoints,
        armor: currentPlayer.armor + 1,
        gold: gold
      };
    } else if (defenseItem.index === 1) {
      player = {
        ...currentPlayer,
        hitpoints: currentPlayer.maxHitpoints + 200,
        maxHitpoints: currentPlayer.maxHitpoints + 200,
        gold: gold
      };
    } else {
      player = {
        ...currentPlayer,
        hitpoints: currentPlayer.maxHitpoints,
        gold: gold,
        items: [...currentPlayer.items, {id: defenseItem.id, lastUpdated: 0}]
      };
    }
    gong.play();
    updateState({currentPlayer: player});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Defense = ({updateState, imageSrc, currentPlayer, defenseItem}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(updateState, currentPlayer, defenseItem)}>
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
