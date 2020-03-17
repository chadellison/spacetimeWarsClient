import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, upgradeSound} from '../constants/settings.js';
import {UPGRADES} from '../constants/settings.js';

const handleClick = (updatePlayerState, currentPlayer, upgrade) => {
  const gold = currentPlayer.gold - UPGRADES[upgrade.index].price;
  if (gold >= 0) {
    let player = {...currentPlayer, gold: gold}
    if (upgrade.index === 0 && player.armor < 5) {
      player.armor += 1
      upgradeSound.play();
      updatePlayerState(player);
    } else if (upgrade.index === 1) {
      player.maxHitpoints += 200
      player.hitpoints += 200
      upgradeSound.play();
      updatePlayerState(player);
    } else if (upgrade.index === 2 && player.velocity < 6) {
      player.velocity += 1
      upgradeSound.play();
      updatePlayerState(player);
    } else if (upgrade.index === 3) {
      player.damage += 100
      upgradeSound.play();
      updatePlayerState(player);
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Upgrade = ({updatePlayerState, imageSrc, currentPlayer, upgrade}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(updatePlayerState, currentPlayer, upgrade)}>
        <img id={upgrade.index} src={imageSrc} alt="item" className="selectionImage"/>
        <div className="selectionData">
          {`${upgrade.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${upgrade.price}`}
        </div>
        <div className="selectionData">
          {`Description: ${upgrade.description}`}
        </div>
    </div>
  );
};
