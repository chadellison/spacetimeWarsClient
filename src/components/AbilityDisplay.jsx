import '../styles/abilityDisplay.css';
import { useState } from 'react';
import Tooltip from './Tooltip';

export const AbilityDisplay = ({ abilityData, title, description }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="shipAbilityIcon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
        {hovered && <Tooltip marginLeft="-150" marginTop="-135" imageSrc={abilityData.abilityImage} title={title} description={description}/>}
      <div className="abilityKey">{abilityData.value.toUpperCase()}</div>
      <img src={abilityData.abilityImage} className="abilityIcon" alt="ship ability" />
    </div>
  )
};

