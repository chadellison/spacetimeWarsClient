import React from "react";
import '../styles/playerStat.css';

export const PlayerStat = ({image, value, alt, className, modifier}) => {
    return (
      <div className={className}>
        <img src={image} alt="target" className="playerDataIcon"/>
        {value}
        {modifier && <span className={modifier[0] === '-' ? 'redModifier' : 'greenModifier'}>{modifier}</span>}
      </div>
    );
};
