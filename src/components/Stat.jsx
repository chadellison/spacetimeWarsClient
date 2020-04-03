import React from 'react';
import '../styles/stat.css';
import {ShipIcon} from './ShipIcon';
import {findColor} from '../helpers/colorHelpers.js';

const resolveStyles = (player) => {
  return {
    width: `${Math.round((player.hitpoints * 100) / player.maxHitpoints)}%`,
    height: '4px',
    backgroundColor: `${findColor(player.hitpoints, player.maxHitpoints)}`
  }
};

export const Stat = ({player}) => {
  return (
    <div className={'playerStat'}>
      <ShipIcon shipIndex={player.shipIndex} className={'opponentShip'}/>
      <div className="opponentInfoWrapper">
        <div className={'opponentInfo'}>{`score: ${player.score}`}</div>
        <div className={'opponentHitpoints'} style={resolveStyles(player)}></div>
      </div>
    </div>
  );
};
