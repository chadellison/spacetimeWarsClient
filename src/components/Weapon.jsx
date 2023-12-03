import React from 'react';
import '../styles/ship.css';
import { loadWeapon, notEnoughResources } from '../constants/settings.js';
import { WEAPONS } from '../constants/weapons.js';
import { handleUpdate } from '../helpers/selectionModalHelpers.js';
import { handleHover } from '../helpers/selectionModalHelpers.js';
import lockIcon from '../images/lockedIcon.png';

const handleClick = (weaponIndex, activePlayer, updateState, players) => {
  const gold = activePlayer.gold - WEAPONS[weaponIndex].price;
  if (gold >= 0 && activePlayer.weaponIndex !== weaponIndex) {
    loadWeapon.play();
    const player = {
      ...activePlayer,
      weaponIndex: weaponIndex,
      gold: gold,
    };

    const newState = handleUpdate(players, player);
    updateState(newState);
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Weapon = ({ imageSrc, weapon, activePlayer, updateState, players, hover, setHover }) => {
  const canAffordWeapon = activePlayer.gold >= WEAPONS[weapon.index].price;
  const ownsWeapon = activePlayer.weaponIndex === weapon.index;

  return (
    <div className={`selection ${ownsWeapon ? 'selected' : ''} ${handleHover(hover, weapon.index)}`}
      onClick={() => handleClick(weapon.index, activePlayer, updateState, players)} onMouseEnter={() => setHover(weapon.index)} onMouseLeave={() => setHover(null)}>
      <div className="imageWrapper">
        <img id={weapon.index} src={canAffordWeapon || ownsWeapon ? imageSrc : lockIcon} alt="weapon" className={`selectionImage ${ownsWeapon && 'owned'}`} />
      </div>
      <span className="itemInfo">
        <div className="selectionTitle">
          {`${weapon.name}`}
        </div>
        <div className="selectionPrice">
          {`Price: ${weapon.price}`}
        </div>
        <div className="selectionData">
          {`Damage: ${weapon.damage}`}
        </div>
        <div className="selectionData">
          {`Cooldown: ${weapon.cooldown}`}
        </div>
        <div className="selectionData">
          {`Speed: ${weapon.speed}`}
        </div>
        <div className="selectionDescription">
          {`Ability: ${weapon.ability}`}
        </div>
      </span>
    </div>
  );
};
