import React from 'react';
import '../styles/ship.css';
import { gong, notEnoughResources } from '../constants/settings.js';
import { SHIPS, generateThrusterAnimation } from '../constants/ships.js';
import { ABILITIES } from '../constants/abilities.js';
import { AbilityDisplay } from './AbilityDisplay';
import { handleHover } from '../helpers/selectionModalHelpers';

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
      thrusterAnimation: generateThrusterAnimation(SHIPS[shipIndex].thrusterOffset.x, SHIPS[shipIndex].thrusterOffset.y)
    }

    if (activePlayer.inPlayers) {
      const updatedPlayers = players.map((p) => {
        if (p.userId === activePlayer.userId) {
          return player;
        } else {
          return p;
        }
      })
      updateState({ players: updatedPlayers })
    } else {
      updateState({ startingPlayer: player, activeTab: 'Weapons', page: 1 });
    }
  } else {
    notEnoughResources.play();
    console.log('Not enough gold');
  }
};

export const Ship = ({ imageSrc, activePlayer, ship, players, updateState, setHover, hover }) => {

  return (
    <div className={`selection ${activePlayer.shipIndex === ship.index ? 'selected' : ''} ${handleHover(hover, ship.index)}`}
      onClick={() => handleClick(activePlayer, updateState, players, ship.index)} onMouseEnter={() => setHover(ship.index)} onMouseLeave={() => setHover(null)}>

      <div className="imageWrapper">
        <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage" />
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
          {`Speed: ${ship.speed}`}
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
