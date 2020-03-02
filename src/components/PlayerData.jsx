import React from "react";
import '../styles/playerData.css';
import {SHIPS, WEAPONS} from '../constants/settings.js';
import {Hitpoints} from './Hitpoints'
const renderLives = (count, image) => {
  let ships = [];
  while (count > 0) {
    ships.push(
      <img className="playerLivesShip"
        src={image}
        alt="ship"
        key={`life${count}`}
      />
    );
    count -= 1;
  };
  return ships;
}

const PlayerData = ({currentPlayer, weapon}) => {
  return (
    <div className="playerData column">
      <div className="row">
        <img className="playerImage" src={`https://robohash.org/${currentPlayer.name}`} alt="player"/>
        <div className="playerInfo">{currentPlayer.name}</div>
        {renderLives(currentPlayer.lives, SHIPS[currentPlayer.shipIndex].image)}
        <img className="playerInfoWeapon" src={WEAPONS[currentPlayer.weaponIndex].selectionImage} alt="weapon"/>
        <Hitpoints hitpoints={currentPlayer.hitpoints} maxHitpoints={currentPlayer.maxHitpoints} />
        <div className="playerInfo">{`Armor: ${SHIPS[currentPlayer.shipIndex].armor}`}</div>
        <div className="playerInfo">{`Gold: 1000`}</div>
        <div className="playerInfo">{`Score: 0`}</div>
      </div>
    </div>
  );
}

export default PlayerData;
