import React from 'react';
import { ABILITIES } from '../constants/abilities.js';
import { gong, notEnoughResources, DEFAULT_ABILITY_DATA } from '../constants/settings.js';
import { SHIPS, generateThrusterAnimation } from '../constants/ships.js';
import { handleHover } from '../helpers/selectionModalHelpers';
import '../styles/ship.css';
import { AbilityDisplay } from './AbilityDisplay';

const handleClick = (activePlayer, updateState, players, shipIndex) => {
  const gold = activePlayer.gold - SHIPS[shipIndex].price;

  if (gold >= 0 && activePlayer.shipIndex !== shipIndex) {
    gong.play();
    const player = {
      ...activePlayer,
      shipIndex,
      gold,
      armor: SHIPS[shipIndex].armor,
      hitpoints: SHIPS[shipIndex].hitpoints,
      maxHitpoints: SHIPS[shipIndex].hitpoints,
      maxSpeed: SHIPS[shipIndex].maxSpeed,
      thrusterAnimation: generateThrusterAnimation(SHIPS[shipIndex].thrusterOffset.x, SHIPS[shipIndex].thrusterOffset.y)
    }

    const updatedPlayers = players.map(p => p.userId === activePlayer.userId ? player : p);
    updateState({ players: updatedPlayers, activeTab: 'Weapons', page: 1, abilityData: DEFAULT_ABILITY_DATA, upgrades: [0, 0, 0, 0] });
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({ imageSrc, activePlayer, ship, players, updateState, setHover, hover }) => {
  const ownsShip = activePlayer.shipIndex === ship.index;

  return (
    <div className={`selection ${ownsShip ? 'selected' : ''} ${handleHover(hover, ship.index)}`}
      onClick={() => handleClick(activePlayer, updateState, players, ship.index)}
      onMouseEnter={() => setHover(ship.index)}
      onMouseLeave={() => setHover(null)}>

      <div className="imageWrapper">
        <img id={ship.index} src={imageSrc} alt="ship" className={`selectionImage ${ownsShip && 'owned'}`} />
      </div>
      <span className="itemInfo">
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
          {`Speed: ${ship.maxSpeed}`}
        </div>
        <div className="abilityTitle">
          Abilities
        </div>
        {[
          { abilityImage: ABILITIES[ship.abilities.q].image, value: 'q' },
          { abilityImage: ABILITIES[ship.abilities.w].image, value: 'w' },
          { abilityImage: ABILITIES[ship.abilities.e].image, value: 'e' }
        ].map((abilityData, index) => {
          const ability = ABILITIES[ship.abilities[abilityData.value]];
          return (
            <AbilityDisplay key={'displayAbility' + index}
              title={ability.name}
              description={ability.description}
              abilityData={abilityData}
            />
          )
        })}
      </span>
    </div>
  );
};
