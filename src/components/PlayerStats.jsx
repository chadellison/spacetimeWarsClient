import React from 'react';
import '../styles/playerStats.css';
import {Stat} from './Stat';

export const PlayerStats = ({players, currentPlayerId}) => {
  return (
    <div className={'playerStats'}>
      {players.filter((player) => !['ai', currentPlayerId].includes(player.id)).map((player) => {
        return <Stat player={player} key={`playerStats${player.id}`} />
      })}
    </div>
  );
};
