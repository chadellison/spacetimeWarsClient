import React from 'react';
import '../styles/playerData.css';
import {ShipIcon} from './ShipIcon';
import {WEAPONS} from '../constants/weapons.js';
import {PlayerItems} from './PlayerItems';

export const GameOverStat = ({player, index}) => {
  return (
    <div className={`gameOverStat ${index === 0 ? 'winner' : ''}`}>
      <ShipIcon shipIndex={player.shipIndex} className={'playerShip'} />
      <img className="playerInfoWeapon"
        src={WEAPONS[player.weaponIndex].selectionImage}
        alt="weapon"
      />
      <div className="NameInfo">{`${player.name}`}</div>
      <div className="DamageInfo">{`Damage: ${player.damage}`}</div>
      <div className="ArmorInfo">{`Armor: ${player.armor}`}</div>
      <div className="SpeedInfo">{`Speed: ${player.velocity}`}</div>
      <div className={`${index === 0 ? 'winningScore' : 'finalScore'}`}>{`Score: ${player.score}`}</div>
      <PlayerItems items={player.items} />
    </div>
  );
};
