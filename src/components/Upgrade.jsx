import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, upgradeSound} from '../constants/settings.js';
import {UPGRADES} from '../constants/upgrades.js';
import {handleUpdate} from '../helpers/selectionModalHelpers.js';

const handleClick = (activePlayer, upgrade, updateState, index, players) => {
  const gold = activePlayer.gold - UPGRADES[upgrade.index].price;
  if (gold >= 0) {
    let player = {...activePlayer, gold: gold}
    if (upgrade.index === 0 && player.armor < 5) {
      player.armor += 1
      upgradeSound.play();
      handleUpdate(updateState, players, index, player);
    } else if (upgrade.index === 1 && player.maxHitpoints < 4000) {
      const newHitpoints = player.maxHitpoints + 200
      player.maxHitpoints = newHitpoints > 4000 ? 4000 : newHitpoints;
      const hitpoints = player.hitpoints + 200;
      player.hitpoints = hitpoints > player.maxHitpoints ? player.maxHitpoints : hitpoints;
      upgradeSound.play();
      handleUpdate(updateState, players, index, player);

    } else if (upgrade.index === 2 && player.velocity < 6) {
      player.velocity += 1
      upgradeSound.play();
      handleUpdate(updateState, players, index, player);

    } else if (upgrade.index === 3 && player.damage < 1000) {
      const newDamage =  player.damage + 50
      player.damage = newDamage > 1000 ? 1000 : newDamage
      upgradeSound.play();
      handleUpdate(updateState, players, index, player);
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Upgrade = ({imageSrc, activePlayer, upgrade, updateState, index, players}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(activePlayer, upgrade, updateState, index, players)}>
        <div className="imageWrapper">
          <img id={upgrade.index} src={imageSrc} alt="item" className="selectionImage"/>
        </div>
        <div className="selectionTitle">
          {`${upgrade.name}`}
        </div>
        <div className="selectionPrice">
          {`Price: ${upgrade.price}`}
        </div>
        <div className="selectionDescription">
          {upgrade.description}
        </div>
    </div>
  );
};
