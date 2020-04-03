import React from 'react';
import '../styles/stat.css';
import {ShipIcon} from './ShipIcon';

export const Stat = ({player}) => {
  return (
    <div className={'playerStat'}>
      <ShipIcon shipIndex={player.shipIndex} className={'opponentShip'}/>
      <div className="opponentInfoWrapper">
        <div className={'opponentInfo'}>{`score: ${player.score}`}</div>
        <div className={'opponentInfo'}>{player.hitpoints}</div>
      </div>
    </div>
  );
};
