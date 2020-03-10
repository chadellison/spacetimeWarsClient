import React from "react";
import '../styles/playerData.css';
import {SHIPS, WEAPONS, ITEMS} from '../constants/settings.js';
import {Hitpoints} from './Hitpoints'
import {findElapsedTime} from '../helpers/gameLogic.js';

const renderLives = (currentPlayer) => {
  if (currentPlayer.shipIndex || currentPlayer.shipIndex === 0) {
  let image = SHIPS[currentPlayer.shipIndex].image
    return (
      <img className="playerLivesShip"
        src={image}
        alt="ship"
      />
    );
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
      <div className="playerInfo">{`${type}: ${value}`}</div>
    );
  };
}

const renderItems = (items) => {
  return items.map((item) => {
    return (
      <img
        src={ITEMS[item.index].image}
        className="playerItem"
        alt="playerItem"
      />
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

const renderShopButton = (lastEvent, updateState, showSelectionModal) => {
  if (['waiting', 'remove'].includes(lastEvent) && !showSelectionModal) {
    return <div className="shopButton" onClick={() => updateState({showSelectionModal: true})}>Shop</div>
  } else {
    return null;
  }
}

const PlayerData = ({currentPlayer, clockDifference, updateState, showSelectionModal}) => {
  const elapsedSeconds = findElapsedTime(clockDifference, currentPlayer.updatedAt) / 1000;
  let countDown = 0;
  if (currentPlayer.explode && elapsedSeconds < 10) {
    countDown = Math.round(10 - elapsedSeconds);
  } else {
    if (currentPlayer.explode) {
      updateState({currentPlayer: {...currentPlayer, explode: false, lastEvent: 'waiting'}});
    };
  };

  if (currentPlayer.id) {
    return (
      <div className={`playerData column ${currentPlayer.explode ? 'waiting' : ''}`}>
        <div className="row">
          {handleWaitTime(currentPlayer, countDown)}
          {renderData('Gold', currentPlayer.gold)}
          {renderHitPoints(currentPlayer)}
          {renderLives(currentPlayer)}
          {renderWeapon(currentPlayer.weaponIndex)}
          {renderData('Armor', currentPlayer.armor)}
          {renderData('Speed', currentPlayer.velocity)}
          {renderData('Score', currentPlayer.score)}
          {renderItems(currentPlayer.items)}
          {renderShopButton(currentPlayer.lastEvent, updateState, showSelectionModal)}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default PlayerData;
