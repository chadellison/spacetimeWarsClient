import React from "react";
import '../styles/playerData.css';

export const PlayerEffects = ({effects}) => {
  return Object.values(effects).map((effect) => {
    return (
      <div className="playerEffectData" key={'playerEffect' + effect.id}>
        <div style={{color: effect.color}}>{effect.name}</div>
      </div>
    )
  });
}
