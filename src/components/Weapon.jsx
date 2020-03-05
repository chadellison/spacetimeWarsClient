import React from 'react'
import '../styles/ship.css'
import {loadWeapon, notEnoughResources} from '../constants/settings.js';
import {WEAPONS} from '../constants/settings.js';

const handleClick = (updateState, weaponIndex, waitingPlayer) => {
  const gold = waitingPlayer.gold - WEAPONS[weaponIndex].price;
  if (gold >= 0) {
    loadWeapon.play();
    updateState({waitingPlayer: {...waitingPlayer, weaponIndex, gold}});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Weapon = ({updateState, imageSrc, weapon, waitingPlayer}) => {
  return (
    <div className={`selection ${waitingPlayer.weaponIndex === weapon.index ? 'selected' : ''}`}
      onClick={() => handleClick(updateState, weapon.index, waitingPlayer)}>
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
