import React from 'react';
import '../styles/levelUpIcon.css';

export const LevelUpIcon = ({ability, abilityKey, abilityLevel}) => {
  return (
    <div className="levelUpIcon">
      <img src={ability.image} className={'icon'} alt="ability icon"/>
      <div className="abilityIconKey">{abilityKey.toUpperCase()}</div>
      <div className="abilityLevel">{abilityLevel + 1}</div>
    </div>
  );
};
