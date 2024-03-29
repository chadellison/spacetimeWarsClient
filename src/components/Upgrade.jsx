import React from 'react';
import '../styles/ship.css';
import { notEnoughResources, upgradeSound } from '../constants/settings.js';
import { handleUpdate } from '../helpers/selectionModalHelpers.js';
import { handleHover } from '../helpers/selectionModalHelpers.js';

const handleClick = (activePlayer, upgrade, updateState, players, upgrades, experiencePoints) => {
  if (experiencePoints > 0 && upgrades[upgrade.index] < 3) {
    let player = { ...activePlayer };
    let newState;
    let newUpgrades = [...upgrades]
    switch (upgrade.index) {
      case 0:
        upgradeSound.play();
        player.armor += 1
        newState = handleUpdate(players, player);
        newUpgrades[0] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 1:
        upgradeSound.play();
        player.maxHitpoints += 300;
        player.hitpoints += 300;
        newState = handleUpdate(players, player);
        newUpgrades[1] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 2:
        upgradeSound.play();
        player.maxSpeed += 1
        newState = handleUpdate(players, player);
        newUpgrades[2] += 1;
        newState['upgrades'] = newUpgrades;
        updateState(newState);
        break;
      case 3:
        upgradeSound.play();
        player.damage += 50
        newState = handleUpdate(players, player);
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

export const Upgrade = ({ imageSrc, activePlayer, upgrade, updateState, players, upgrades, experiencePoints, hover, setHover }) => {
  if (upgrades[upgrade.index] === 3) {
    return <div></div>
  } else {
    return (
      <div className={`selection ${handleHover(hover, upgrade.index)}`}
        onClick={() => handleClick(activePlayer, upgrade, updateState, players, upgrades, experiencePoints)} onMouseEnter={() => setHover(upgrade.index)} onMouseLeave={() => setHover(null)}>
        <div className="imageWrapper">
          <img id={upgrade.index} src={imageSrc} alt="item" className="selectionImage" />
        </div>
        <span className="itemInfo">
          <div className="selectionTitle">
            {`${upgrade.name}`}
          </div>
          <div className="selectionTitle">
            {`Level ${upgrades[upgrade.index] + 1}`}
          </div>
          <div className="selectionDescription">
            {upgrade.description}
          </div>
        </span>
      </div>
    );
  }
};
