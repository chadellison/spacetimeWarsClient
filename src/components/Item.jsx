import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, gong} from '../constants/settings.js';
import {ITEMS} from '../constants/settings.js';

const handleClick = (updateState, currentPlayer, item) => {
  const gold = currentPlayer.gold - ITEMS[item.index].price;
  if (gold >= 0) {
    const player = {
      ...currentPlayer,
      items: [...currentPlayer.items, {id: item.id, lastUpdated: 0}],
      gold: gold
    }
    gong.play();
    updateState({currentPlayer: player});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Item = ({updateState, imageSrc, currentPlayer, item}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(updateState, currentPlayer, item)}>
        <img id={item.index} src={imageSrc} alt="item" className="selectionImage"/>
        <div className="selectionData">
          {`${item.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${item.price}`}
        </div>
        <div className="selectionData">
          {`Description: ${item.description}`}
        </div>
    </div>
  );
};
