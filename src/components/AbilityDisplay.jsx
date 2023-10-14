import '../styles/abilityDisplay.css';
import { useState } from 'react';
import Tooltip from './Tooltip';

export const AbilityDisplay = ({ abilityData, info }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="shipAbilityIcon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
        {hovered && <Tooltip marginLeft={'0'} marginTop="-110" imageSrc={abilityData.abilityImage} description={info}/>}
      <div className="abilityKey">{abilityData.value.toUpperCase()}</div>
      <img src={abilityData.abilityImage} className="abilityIcon" alt="ship ability" />
    </div>
  )
};

