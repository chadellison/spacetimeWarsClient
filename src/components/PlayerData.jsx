import React from "react";
import '../styles/playerData.css';
import {WEAPONS} from '../constants/weapons.js';
import {UPGRADES} from '../constants/upgrades.js';
import goldIcon from "../images/gold.png";
import {Hitpoints} from './Hitpoints';
import {PlayerItems} from './PlayerItems';
import {PlayerStat} from './PlayerStat';
import {ShipIcon} from './ShipIcon';
import {findElapsedTime} from '../helpers/gameLogic.js';

const renderShip = (currentPlayer) => {
  if (currentPlayer.shipIndex || currentPlayer.shipIndex === 0) {
    return <ShipIcon shipIndex={currentPlayer.shipIndex} team={currentPlayer.team} className={'playerShip'}/>
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

const renderArmor = (player) => {
  if (player.armor >= 0) {
    let value = player.armor
    if (player.effects[7]) {
      value += 4
    }
    return <PlayerStat image={UPGRADES[0].image} alt={'shield'} value={value} className="statInfo" />
  }
}
const renderSpeed = (player) => {
  if (player.velocity) {
    const value = player.effects[2] ? 1 : player.velocity;
    return <PlayerStat image={UPGRADES[2].image} alt={'speedometer'} value={value} className="statInfo" />
  }
}

const handlePlayerIcon = (currentPlayer, countDown) => {
  if (countDown > 0) {
    return <span className="waitCountDown">{countDown}</span>;
  } else {
    return <img className="playerImage" src={`https://robohash.org/${currentPlayer.id}?color=${currentPlayer.team}`} alt="player"/>;
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

const PlayerData = ({currentPlayer, clockDifference, updateState, players, defenseData}) => {
  const elapsedSeconds = findElapsedTime(clockDifference, currentPlayer.updatedAt) / 1000;
  let countDown = 0;
  if (currentPlayer.explode && elapsedSeconds < 10) {
    countDown = Math.round(10 - elapsedSeconds);
  }

  const {gold, damage} = currentPlayer;

  return (
    <div className={`playerData column ${currentPlayer.explode ? 'waiting' : ''}`}>
      <div className="row">
        {currentPlayer.updatedAt && handlePlayerIcon(currentPlayer, countDown)}
        <div className="nameInfo">{currentPlayer.name}</div>
        {gold >= 0 && <PlayerStat image={goldIcon} alt={'gold'} value={gold} className="goldInfo"/>}
        {renderHitPoints(currentPlayer)}
        {currentPlayer.updatedAt && renderShip(currentPlayer)}
        {renderWeapon(currentPlayer.weaponIndex)}
        {damage > 0 && <PlayerStat image={UPGRADES[3].image} alt={'target'} value={damage} className="statInfo"/>}
        {renderArmor(currentPlayer)}
        {renderSpeed(currentPlayer)}
        <div className="ScoreInfo">{`Score: ${currentPlayer.score}`}</div>
        <PlayerItems items={currentPlayer.items} />
        <div className="defenseData">Defenses</div>
        <div className="redDefenseData">{defenseData.red}</div>
        <div className="blueDefenseData">{defenseData.blue}</div>
      </div>
    </div>
  );
}

export default PlayerData;
