import React from "react";
import '../styles/playerData.css';

export const PlayerEffects = ({effects}) => {
  return Object.values(effects).map((effect) => {
    return (
      <div className="playerEffectData" key={'playerEffect' + effect.id}>
        <div style={{color: 'white'}}>{effect.name}</div>
      </div>
    )
  });
}
