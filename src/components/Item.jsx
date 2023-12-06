import { useState } from 'react';
import { ITEMS } from '../constants/items.js';
import { goldAudio, notEnoughResources } from '../constants/settings.js';
import { getItem } from '../helpers/itemHelpers.js';
import { handleHover, handleUpdate } from '../helpers/selectionModalHelpers.js';
import '../styles/item.css';
import Tooltip from './Tooltip';

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
    } else if (item.id === 17) {
      player.hitpoints += 500;
      player.maxHitpoints += 500;
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
  const ownsItem = getItem(activePlayer.items, item.id);

  return (
    <div className={`itemSelection ${handleHover(hover, item.index)}`}
      onClick={() => handleClick(activePlayer, item, updateState, players)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="itemImageWrapper">
        <img id={item.index} src={imageSrc} alt="item" className={`itemSelectionImage ${ownsItem && 'owned'}`} />
      </div>
        {hovered && <Tooltip marginLeft="-150" marginTop="10" title={item.name} price={item.price} imageSrc={imageSrc} description={item.description}/>}
    </div>
  );
};
