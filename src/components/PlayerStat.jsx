import React from "react";
import '../styles/playerStat.css';

export const PlayerStat = ({image, value, alt, className}) => {
    return (
      <div className={className}>
        <img src={image} alt="target" className="playerDataIcon"/>
        {value}
      </div>
    );
};
