import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {getUpdatedPlayers} from '../helpers/gameLogic.js';
import {SHIPS} from '../constants/ships.js';

const handleClick = (shipIndex, currentPlayer, players, updateState) => {
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

    const updatedPlayers = getUpdatedPlayers(player, players);
    updateState({currentPlayer: player, players: updatedPlayers, activeTab: 'Weapons'});
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({imageSrc, currentPlayer, ship, players, updateState}) => {
  return (
    <div className={`selection ${currentPlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(ship.index, currentPlayer, players, updateState)}>
        <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionTitle">
          {`${ship.name}`}
        </div>
        <div className="selectionPrice">
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
