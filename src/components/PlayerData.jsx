import React from "react";
import '../styles/playerData.css';
import {WEAPONS} from '../constants/weapons.js';
import gold from "../images/gold.png";
import {Hitpoints} from './Hitpoints';
import {PlayerStats} from './PlayerStats';
import {PlayerItems} from './PlayerItems';
import {ShipIcon} from './ShipIcon';
import {findElapsedTime} from '../helpers/gameLogic.js';

const renderShip = (currentPlayer) => {
  if (currentPlayer.shipIndex || currentPlayer.shipIndex === 0) {
    return <ShipIcon shipIndex={currentPlayer.shipIndex} className={'playerShip'}/>
  };
}

const renderWeapon = (weaponIndex) => {
  if (weaponIndex || weaponIndex === 0) {
    return (
      <img
        className="playerInfoWeapon"
        src={WEAPONS[weaponIndex].selectionImage}
        alt="weapon"
      />
    )
  }
}

const renderData = (type, value) => {
  if (value >= 0) {
    return (
      <div className={`${type}Info`}>{`${type}: ${value}`}</div>
    );
  };
}

const renderGold = (type, value) => {
  if (value >= 0) {
    return (
      <div className="playerInfo">
        <img src={gold} alt="Gold" className="goldIcon" />
        <span className="GoldInfo">{value}</span>
      </div>
    );
  };
}

const handleWaitTime = (currentPlayer, countDown) => {
  if (countDown > 0) {
    return <span className="waitCountDown">{countDown}</span>;
  } else {
    return <img className="playerImage" src={`https://robohash.org/${currentPlayer.id}`} alt="player"/>;
  };
}

const renderHitPoints = (currentPlayer) => {
  if (currentPlayer.hitpoints > 0) {
    return (
      <Hitpoints
        hitpoints={currentPlayer.hitpoints}
        maxHitpoints={currentPlayer.maxHitpoints}
      />
    );
  }
};

const PlayerData = ({currentPlayer, clockDifference, updateState, players}) => {
  if (currentPlayer.id) {
    const elapsedSeconds = findElapsedTime(clockDifference, currentPlayer.updatedAt) / 1000;
    let countDown = 0;
    if (currentPlayer.explode && elapsedSeconds < 10) {
      countDown = Math.round(10 - elapsedSeconds);
    }

    return (
      <div className={`playerData column ${currentPlayer.explode ? 'waiting' : ''}`}>
        <div className="row">
          {handleWaitTime(currentPlayer, countDown)}
          <div className="NameInfo">{currentPlayer.name}</div>
          {renderGold('Gold', currentPlayer.gold)}
          {renderHitPoints(currentPlayer)}
          {renderShip(currentPlayer)}
          {renderWeapon(currentPlayer.weaponIndex)}
          {renderData('Damage', currentPlayer.damage)}
          {renderData('Armor', currentPlayer.armor)}
          {renderData('Speed', currentPlayer.velocity)}
          {renderData('Score', currentPlayer.score)}
          <PlayerItems items={currentPlayer.items} />
          <PlayerStats players={players} currentPlayerId={currentPlayer.id} />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default PlayerData;
