import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';
import {ABILITIES} from '../constants/abilities.js';
import {AbilityDisplay} from './AbilityDisplay';

const handleClick = (activePlayer, updateState, players, shipIndex) => {
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
    if (activePlayer.index >= 0) {
      let updatedPlayers = [...players];
      updatedPlayers[activePlayer.index] = player
      updateState({players: updatedPlayers})
    } else {
      updateState({startingPlayer: player, activeTab: 'Weapons', page: 1});
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({imageSrc, activePlayer, ship, players, updateState, updateDescription}) => {
  return (
    <div className={`selection ${activePlayer.shipIndex === ship.index ? 'selected' : ''}`}
      onClick={() => handleClick(activePlayer, updateState, players, ship.index)}>
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
      <div className="abilityTitle">
        Abilities
      </div>
        {[
          {abilityImage: ABILITIES[ship.abilities.q].image, value: 'q'},
          {abilityImage: ABILITIES[ship.abilities.w].image, value: 'w'},
          {abilityImage: ABILITIES[ship.abilities.e].image, value: 'e'}
         ].map((abilityData, index) => {
            return (
              <AbilityDisplay key={'displayAbility' + index}
                abilityData={abilityData}
                onMouseEnter={() => updateDescription(ABILITIES[ship.abilities[abilityData.value]].description)}
                onMouseLeave={() => updateDescription('')}
              />
            )
        })}
    </div>
  );
};
