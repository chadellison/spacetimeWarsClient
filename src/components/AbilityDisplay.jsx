import React from 'react';
import '../styles/abilityDisplay.css';

export const AbilityDisplay = ({onMouseEnter, onMouseLeave, abilityData}) => {
  return (
    <div className="shipAbilityIcon"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className="abilityKey">{abilityData.value.toUpperCase()}</div>
      <img src={abilityData.abilityImage} className="abilityIcon" alt="ship ability"/>
    </div>
  )
}
