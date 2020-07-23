import React from 'react';
import '../styles/ship.css';
import {notEnoughResources, upgradeSound} from '../constants/settings.js';
import {UPGRADES} from '../constants/upgrades.js';
import {handleUpdate} from '../helpers/selectionModalHelpers.js';

const handleClick = (activePlayer, upgrade, updateState, index, players, upgrades) => {
  const gold = activePlayer.gold - UPGRADES[upgrade.index].price;
  if (gold >= 0 && upgrades[upgrade.index] < 3) {
    let player = {...activePlayer, gold: gold}
    let newState;
    let newUpgrades = [...upgrades]
    switch (upgrade.index) {
      case 0:
        upgradeSound.play();
        player.armor += 1
        newState = handleUpdate(players, index, player);
        newUpgrades[0] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 1:
        upgradeSound.play();
        player.maxHitpoints += 200;
        player.hitpoints += 200;
        newState = handleUpdate(players, index, player);
        newUpgrades[1] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 2:
        upgradeSound.play();
        player.velocity += 1
        newState = handleUpdate(players, index, player);
        newUpgrades[2] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 3:
        upgradeSound.play();
        player.damage += 50
        newState = handleUpdate(players, index, player);
        newUpgrades[3] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      default:
        break;
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Upgrade = ({imageSrc, activePlayer, upgrade, updateState, index, players, upgrades}) => {
  return (
    <div className="selection"
      onClick={() => handleClick(activePlayer, upgrade, updateState, index, players, upgrades)}>
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
