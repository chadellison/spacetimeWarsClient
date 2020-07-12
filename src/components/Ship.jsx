import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';

const handleClick = (shipIndex, activePlayer, updateState, index, players) => {
  const gold = activePlayer.gold - SHIPS[shipIndex].price;

  if (gold >= 0) {
    gong.play();
    const player = {
      ...activePlayer,
      shipIndex: shipIndex,
      gold: gold,
      armor: SHIPS[shipIndex].armor,
      hitpoints: SHIPS[shipIndex].hitpoints,
      maxHitpoints: SHIPS[shipIndex].hitpoints,
      velocity: SHIPS[shipIndex].speed,
    }
    if (index !== null) {
      let updatedPlayers = [...players];
      updatedPlayers[index] = player
      updateState({players: updatedPlayers})
    } else {
      updateState({startingPlayer: player, activeTab: 'Weapons', page: 1});
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({imageSrc, activePlayer, ship, updateState, index, players}) => {
  return (
    <div className={`selection ${activePlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(ship.index, activePlayer, updateState, index, players)}>
        <div className="imageWrapper">
          <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage"/>
        </div>
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
        <div className="shipAbilityIcon">
          <img src={ship.ability.image} className="QAbilityIcon" alt="ship ability"/>
          <div className="QKey">Q</div>
        </div>
        <div className="selectionDescription">
          {ship.ability.description}
        </div>
    </div>
  );
};
