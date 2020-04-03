import React from 'react';
import '../styles/stat.css';
import {ShipIcon} from './ShipIcon';

export const Stat = ({player}) => {
  return (
    <div className={'playerStat column '}>
      <ShipIcon shipIndex={player.shipIndex} />
      <div className={'playerScore'}>{`score: ${player.score}`}</div>
      <div className={'playerHitpoins'}>{player.hitpoints}</div>
    </div>
  );
};
