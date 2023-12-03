import { useState } from 'react';
import '../styles/item.css';
import { getItem } from '../helpers/itemHelpers.js';
import { handleUpdate } from '../helpers/selectionModalHelpers.js';
import { notEnoughResources, goldAudio } from '../constants/settings.js';
import { ITEMS } from '../constants/items.js';
import { handleHover } from '../helpers/selectionModalHelpers.js';
import Tooltip from './Tooltip';
import lockIcon from '../images/lockedIcon.png';

const handleClick = (activePlayer, item, updateState, players) => {
  const gold = activePlayer.gold - ITEMS[item.index].price;
  if (gold >= 0 && !getItem(activePlayer.items, item.id)) {
    const player = {
      ...activePlayer,
      items: {
        ...activePlayer.items,
        [item.id]: { ...item, durationCount: item.cooldown }
      },
      gold
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
  const canAffordItem = activePlayer.gold >= ITEMS[item.index].price;
  const ownsItem = getItem(activePlayer.items, item.id);

  return (
    <div className={`itemSelection ${handleHover(hover, item.index)}`}
      onClick={() => handleClick(activePlayer, item, updateState, players)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="itemImageWrapper">
        <img id={item.index} src={canAffordItem ? imageSrc : lockIcon} alt="item" className={`itemSelectionImage ${ownsItem && 'owned'}`} />
      </div>
        {hovered && <Tooltip marginLeft="-150" marginTop="10" title={item.name} price={item.price} imageSrc={imageSrc} description={item.description}/>}
    </div>
  );
};
