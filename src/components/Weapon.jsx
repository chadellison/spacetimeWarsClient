import React from 'react'
import '../styles/ship.css'

export const Weapon = ({updateState, imageSrc, index, weapon, selectedWeaponIndex}) => {
  return (
    <div className={`selection ${selectedWeaponIndex === index ? 'selected' : ''}`}
      onClick={() => updateState({weaponIndex: index})}>
        <img id={index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionData">
          {`Name: ${weapon.name}`}
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
