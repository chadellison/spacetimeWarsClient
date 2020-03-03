import React from "react";
import '../styles/playerData.css';
import {SHIPS, WEAPONS} from '../constants/settings.js';
import {Hitpoints} from './Hitpoints'
import {findElapsedTime} from '../helpers/gameLogic.js';

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

const handleWaitTime = (currentPlayer, clockDifference, updateState) => {
  const elapsedSeconds = findElapsedTime(clockDifference, currentPlayer.updatedAt) / 1000;
  if (currentPlayer.explode && elapsedSeconds < 10) {
    return <span className="waitCountDown">{Math.round(10 - elapsedSeconds)}</span>;
  } else {
    if (currentPlayer.explode) {
      const waitingPlayer = {...currentPlayer, explode: false};
      updateState({waitingPlayer: waitingPlayer});
    };
    return <img className="playerImage" src={`https://robohash.org/${currentPlayer.id}`} alt="player"/>;
  }
}

const PlayerData = ({currentPlayer, weapon, clockDifference, updateState}) => {
  return (
    <div className={`playerData column ${currentPlayer.explode ? 'waiting' : ''}`}>
      <div className="row">
        {handleWaitTime(currentPlayer, clockDifference, updateState)}
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
