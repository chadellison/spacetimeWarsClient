import React from 'react';
import '../styles/playerStats.css';
import {Stat} from './Stat';

export const PlayerStats = ({players, currentPlayerId}) => {
  return (
    <div className={'playerStats'}>
      {
        players.filter((player) => currentPlayerId !== player.id && player.type !== 'ai')
               .map((player) => <Stat player={player} key={`playerStats${player.id}`} />)
      }
    </div>
  );
};
