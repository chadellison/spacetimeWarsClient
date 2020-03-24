import React from 'react';
import '../styles/ship.css';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';
import {loadWeapon, notEnoughResources} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

const handleClick = (weaponIndex, currentPlayer, players, updateState) => {
  const gold = currentPlayer.gold - WEAPONS[weaponIndex].price;
  if (gold >= 0) {
    loadWeapon.play();
    const updatedPlayer = {
      ...currentPlayer,
      weaponIndex: weaponIndex,
      damage: WEAPONS[weaponIndex].damage,
      gold: gold
    };
    updateState({currentPlayer: updatedPlayer, players: getUpdatedPlayers(updatedPlayer, players)});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Weapon = ({imageSrc, weapon, currentPlayer, players, updateState}) => {
  return (
    <div className={`selection ${currentPlayer.weaponIndex === weapon.index ? 'selected' : ''}`}
      onClick={() => handleClick(weapon.index, currentPlayer, players, updateState)}>
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
