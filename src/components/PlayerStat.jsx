import React from "react";
import '../styles/playerStat.css';

export const PlayerStat = ({image, value, alt, className, modifier}) => {
  let displayModifier = '';
  if (modifier) {
    displayModifier = modifier > 0 ? '+' + modifier.toString() : modifier.toString();
  }
  return (
    <div className={className}>
      <img src={image} alt={alt} className="playerDataIcon"/>
      {value}
      {displayModifier && <span className={displayModifier[0] === '-' ? 'redModifier' : 'greenModifier'}>{displayModifier}</span>}
    </div>
  );
};
