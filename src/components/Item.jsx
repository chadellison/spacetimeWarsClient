import React from 'react';
import '../styles/item.css';
import {getItem} from '../helpers/itemHelpers.js';
import {handleUpdate} from '../helpers/selectionModalHelpers.js';
import {notEnoughResources, goldAudio} from '../constants/settings.js';
import {ITEMS} from '../constants/items.js';

const handleClick = (activePlayer, item, updateState, players) => {
  const gold = activePlayer.gold - ITEMS[item.index].price;
  if (gold >= 0 && !getItem(activePlayer.items, item.id)) {
    let player = {
      ...activePlayer,
      items: {
        ...activePlayer.items,
        [item.id]: { index: item.index, durationCount: item.cooldown, cooldown: item.cooldown }
      },
      gold: gold
    }
    if (item.id === 8) {
      player.hitpoints += 1200;
      player.maxHitpoints += 1200;
    }
    goldAudio.play();
    const newState = handleUpdate(players, player);
    updateState(newState);
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Item = ({imageSrc, activePlayer, item, updateState, players, updateDescription}) => {
  return (
    <div className="itemSelection"
      onClick={() => handleClick(activePlayer, item, updateState, players)}
      onMouseEnter={() => updateDescription(item.description)}
      onMouseLeave={() => updateDescription('')}>
        <div className="itemImageWrapper">
          <img id={item.index} src={imageSrc} alt="item" className="itemSelectionImage"/>
        </div>
        <div className="itemSelectionTitle">
          {`${item.name}`}
        </div>
        <div className="itemSelectionPrice">
          {`Price: ${item.price}`}
        </div>
    </div>
  );
};
