import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';

const handleClick = (updatePlayerState, shipIndex, currentPlayer) => {
  const gold = currentPlayer.gold - SHIPS[shipIndex].price;

  if (gold >= 0) {
    gong.play();
    const player = {
      ...currentPlayer,
      shipIndex: shipIndex,
      gold: gold,
      armor: SHIPS[shipIndex].armor,
      hitpoints: SHIPS[shipIndex].hitpoints,
      maxHitpoints: SHIPS[shipIndex].hitpoints,
      velocity: SHIPS[shipIndex].speed,
    }
    updatePlayerState(player);
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({updatePlayerState, imageSrc, currentPlayer, ship}) => {
  return (
    <div className={`selection ${currentPlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(updatePlayerState, ship.index, currentPlayer)}>
        <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionData">
          {`${ship.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${ship.price}`}
        </div>
        <div className="selectionData">
          {`Hitpoints: ${ship.hitpoints}`}
        </div>
        <div className="selectionData">
          {`Armor: ${ship.armor}`}
        </div>
        <div className="selectionData">
          {`Speed: ${ship.speed}`}
        </div>
    </div>
  );
};
