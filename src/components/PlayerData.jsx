import React from "react";
import '../styles/playerData.css';
import {WEAPONS} from '../constants/weapons.js';
import {ITEMS} from '../constants/items.js';
import gold from "../images/gold.png";
import {Hitpoints} from './Hitpoints';
import {GameButton} from './GameButton';
import {Stat} from './Stat';
import {ShipIcon} from './ShipIcon';
import {findElapsedTime} from '../helpers/gameLogic.js';

const renderShip = (currentPlayer) => {
  if (currentPlayer.shipIndex || currentPlayer.shipIndex === 0) {
    return <ShipIcon shipIndex={currentPlayer.shipIndex}/>
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

const renderItems = (items, clockDifference) => {
  return Object.values(items).map((item) => {
    let elapsedTime = findElapsedTime(clockDifference, item.lastUpdated);
    let countDown = 0;
    if (elapsedTime < item.cooldown) {
      countDown = Math.round((item.cooldown - elapsedTime) / 1000);
    }
    return (
      <div className="playerItemData">
        <div className="itemCountDown" hidden={countDown === 0 || countDown > 9}>
          {countDown}
        </div>
        <img
          key={'playerItem' + item.index}
          className={`playerItemImage${countDown ? ' faded' : ''}`}
          src={ITEMS[item.index].image}
          alt="playerItem"
        />
      </div>
    )
  });
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

const renderPlayerStats = (showPlayerStats, players, currentPlayerId) => {
  if (showPlayerStats) {
    return players.filter((player) => player.id !== currentPlayerId).map((player) => {
      return <Stat player={player} key={`playerStats${player.id}`} />
    });
  } else {
    return null;
  }
};

const PlayerData = ({currentPlayer, clockDifference, updateState, showPlayerStats, players}) => {
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
          {renderGold('Gold', currentPlayer.gold)}
          {renderHitPoints(currentPlayer)}
          {renderShip(currentPlayer)}
          {renderWeapon(currentPlayer.weaponIndex)}
          {renderData('Damage', currentPlayer.damage)}
          {renderData('Armor', currentPlayer.armor)}
          {renderData('Speed', currentPlayer.velocity)}
          {renderData('Score', currentPlayer.score)}
          {renderItems(currentPlayer.items, clockDifference)}
          <GameButton
            className={'playerStatsButton'}
            onClick={() => updateState({showPlayerStats: !showPlayerStats})}
            buttonText={showPlayerStats ? 'hide stats' : 'stats'}
          />
          {renderPlayerStats(showPlayerStats, players, currentPlayer.id)}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default PlayerData;
