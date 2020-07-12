import React from 'react';
import '../styles/ship.css';
import {getItem} from '../helpers/itemHelpers.js';
import {handleUpdate} from '../helpers/selectionModalHelpers.js';
import {notEnoughResources, goldAudio} from '../constants/settings.js';
import {ITEMS} from '../constants/items.js';

const handleClick = (activePlayer, item, updateState, index, players) => {
  const gold = activePlayer.gold - ITEMS[item.index].price;
  if (gold >= 0 && !getItem(activePlayer.items, item.id)) {
    const player = {
      ...activePlayer,
      items: {
        ...activePlayer.items,
        [item.id]: { index: item.index, durationCount: item.cooldown, cooldown: item.cooldown }
      },
      gold: gold
    }
    goldAudio.play();
    handleUpdate(updateState, players, index, player);
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Item = ({imageSrc, activePlayer, item, updateState, index, players}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(activePlayer, item, updateState, index, players)}>
        <div className="imageWrapper">
          <img id={item.index} src={imageSrc} alt="item" className="selectionImage"/>
        </div>
        <div className="selectionTitle">
          {`${item.name}`}
        </div>
        <div className="selectionPrice">
          {`Price: ${item.price}`}
        </div>
        <div className="selectionDescription">
          {item.description}
        </div>
    </div>
  );
};
