import React from 'react';
import '../styles/ship.css';
import {loadWeapon, notEnoughResources} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';
import {handleUpdate} from '../helpers/selectionModalHelpers.js';

const handleClick = (weaponIndex, activePlayer, updateState, index, players) => {
  const gold = activePlayer.gold - WEAPONS[weaponIndex].price;
  if (gold >= 0) {
    loadWeapon.play();
    const player = {
      ...activePlayer,
      weaponIndex: weaponIndex,
      damage: WEAPONS[weaponIndex].damage,
      gold: gold
    };

    handleUpdate(updateState, players, index, player);
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Weapon = ({imageSrc, weapon, activePlayer, updateState, index, players}) => {
  return (
    <div className={`selection ${activePlayer.weaponIndex === weapon.index ? 'selected' : ''}`}
      onClick={() => handleClick(weapon.index, activePlayer, updateState, index, players)}>
        <div className="imageWrapper">
          <img id={weapon.index} src={imageSrc} alt="ship" className="selectionImage"/>
        </div>
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
    </div>
  );
};
