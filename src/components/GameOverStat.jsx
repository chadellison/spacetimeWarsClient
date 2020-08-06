import React from 'react';
import '../styles/playerStat.css';
import {ShipIcon} from './ShipIcon';
import {WEAPONS} from '../constants/weapons.js';
import {UPGRADES} from '../constants/upgrades.js';
import {PlayerItems} from './PlayerItems';
import {PlayerStat} from './PlayerStat';

export const GameOverStat = ({player, index}) => {
  return (
    <div className={`gameOverStat ${index === 0 ? 'winner' : ''}`}>
      <ShipIcon shipIndex={player.shipIndex} className={'playerShip'} team={player.team} />
      <img className="playerInfoWeapon"
        src={WEAPONS[player.weaponIndex].selectionImage}
        alt="weapon"
      />
      <div className="playerInfo">{`${player.name}`}</div>
      <div className="playerInfo">{`level: ${player.level}`}</div>
      <PlayerStat image={UPGRADES[3].image} alt={'target'} value={player.damage} className="statInfo"/>
      <PlayerStat image={UPGRADES[0].image} alt={'shield'} value={player.armor} className="statInfo"/>
      <PlayerStat image={UPGRADES[2].image} alt={'speedometer'} value={player.velocity} className="statInfo"/>
      <div className="playerInfo">{`kills: ${player.kills}`}</div>
      <div className={`${index === 0 ? 'winningScore' : 'finalScore'}`}>{`Score: ${player.score}`}</div>
      <PlayerItems items={player.items} />
    </div>
  );
};
