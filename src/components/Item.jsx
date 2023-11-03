import { useState } from 'react';
import '../styles/item.css';
import { getItem } from '../helpers/itemHelpers.js';
import { handleUpdate } from '../helpers/selectionModalHelpers.js';
import { notEnoughResources, goldAudio } from '../constants/settings.js';
import { ITEMS } from '../constants/items.js';
import { handleHover } from '../helpers/selectionModalHelpers.js';
import Tooltip from './Tooltip';

const handleClick = (activePlayer, item, updateState, players) => {
  const gold = activePlayer.gold - ITEMS[item.index].price;
  if (gold >= 0 && !getItem(activePlayer.items, item.id)) {
    let player = {
      ...activePlayer,
      items: {
        ...activePlayer.items,
        [item.id]: { index: item.index, durationCount: item.cooldown, cooldown: item.cooldown, effectIndex: item.effectIndex }
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

export const Item = ({ imageSrc, activePlayer, item, updateState, players, hover }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`itemSelection ${handleHover(hover, item.index)}`}
      onClick={() => handleClick(activePlayer, item, updateState, players)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="itemImageWrapper">
        <img id={item.index} src={imageSrc} alt="item" className="itemSelectionImage" />
      </div>
      <span className="itemInfo">
        {hovered && <Tooltip marginLeft="0" marginTop="0" imageSrc={imageSrc} description={item.description}/>}
        <div className="itemSelectionTitle">
          {`${item.name}`}
        </div>
        <div className="itemSelectionPrice">
          {`Price: ${item.price}`}
        </div>
      </span>
    </div>
  );
};
