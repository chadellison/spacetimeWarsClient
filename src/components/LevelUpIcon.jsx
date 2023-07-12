import React from 'react';
import '../styles/levelUpIcon.css';

export const LevelUpIcon = ({ ability, abilityKey, abilityLevel, onClick }) => {
  return (
    <div className="levelUpIcon" onClick={onClick}>
      <img src={ability.image} className={'icon'} alt="ability icon" />
      <div className="abilityIconKey">{abilityKey.toUpperCase()}</div>
      <div className="abilityLevel">{abilityLevel + 1}</div>
    </div>
  );
};
