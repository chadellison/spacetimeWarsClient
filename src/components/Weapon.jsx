import React from 'react'
import '../styles/ship.css'
import {loadWeapon} from '../constants/settings.js';

const handleClick = (updateState, weaponIndex) => {
  loadWeapon.play();
  updateState({weaponIndex: weaponIndex});
};

export const Weapon = ({updateState, imageSrc, weapon, selectedWeaponIndex}) => {
  return (
    <div className={`selection ${selectedWeaponIndex === weapon.index ? 'selected' : ''}`}
      onClick={() => handleClick(updateState, weapon.index)}>
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
