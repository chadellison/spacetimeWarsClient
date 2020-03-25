import React from 'react';
import '../styles/ship.css';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';
import {getItem} from '../helpers/itemHelpers.js';
import {notEnoughResources, gong} from '../constants/settings.js';
import {ITEMS} from '../constants/items.js';

const handleClick = (currentPlayer, item, players, updateState) => {
  const gold = currentPlayer.gold - ITEMS[item.index].price;
  if (gold >= 0 && !getItem(currentPlayer.items, item.id)) {
    const player = {
      ...currentPlayer,
      items: {
        ...currentPlayer.items,
        [item.id]: { index: item.index, lastUpdated: 0, cooldown: item.cooldown }
      },
      gold: gold
    }
    gong.play();
    updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Item = ({imageSrc, currentPlayer, item, players, updateState}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(currentPlayer, item, players, updateState)}>
        <img id={item.index} src={imageSrc} alt="item" className="selectionImage"/>
        <div className="selectionData">
          {`${item.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${item.price}`}
        </div>
        <div className="selectionDescription">
          {item.description}
        </div>
    </div>
  );
};
