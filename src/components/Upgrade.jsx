import React from 'react';
import '../styles/ship.css';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';
import {notEnoughResources, upgradeSound} from '../constants/settings.js';
import {UPGRADES} from '../constants/upgrades.js';

const handleClick = (currentPlayer, upgrade, players, updateState) => {
  const gold = currentPlayer.gold - UPGRADES[upgrade.index].price;
  if (gold >= 0) {
    let player = {...currentPlayer, gold: gold}
    if (upgrade.index === 0 && player.armor < 5) {
      player.armor += 1
      upgradeSound.play();
      updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)});
    } else if (upgrade.index === 1) {
      player.maxHitpoints += 200
      player.hitpoints += 200
      upgradeSound.play();
      updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)});
    } else if (upgrade.index === 2 && player.velocity < 6) {
      player.velocity += 1
      upgradeSound.play();
      updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)});
    } else if (upgrade.index === 3) {
      player.damage += 100
      upgradeSound.play();
      updateState({currentPlayer: player, players: getUpdatedPlayers(player, players)});
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Upgrade = ({imageSrc, currentPlayer, upgrade, players, updateState}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(currentPlayer, upgrade, players, updateState)}>
        <img id={upgrade.index} src={imageSrc} alt="item" className="selectionImage"/>
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
