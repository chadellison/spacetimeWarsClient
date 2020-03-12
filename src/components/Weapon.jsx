import React from 'react'
import '../styles/ship.css'
import {loadWeapon, notEnoughResources} from '../constants/settings.js';
import {WEAPONS} from '../constants/settings.js';

const handleClick = (updateState, weaponIndex, currentPlayer) => {
  const gold = currentPlayer.gold - WEAPONS[weaponIndex].price;
  if (gold >= 0) {
    loadWeapon.play();
    const updatedPlayer = {
      ...currentPlayer,
      weaponIndex: weaponIndex,
      damage: WEAPONS[weaponIndex].damage,
      gold: gold
    };
    updateState({currentPlayer: updatedPlayer});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Weapon = ({updateState, imageSrc, weapon, currentPlayer}) => {
  return (
    <div className={`selection ${currentPlayer.weaponIndex === weapon.index ? 'selected' : ''}`}
      onClick={() => handleClick(updateState, weapon.index, currentPlayer)}>
        <img id={weapon.index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionData">
          {`${weapon.name}`}
        </div>
        <div className="selectionData">
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
    </div>
  );
};
