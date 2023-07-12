import React from 'react';
import '../styles/abilityIcon.css';
import { PieChart, Pie } from 'recharts';
import { calculateAngle } from '../helpers/mathHelpers';

export const AbilityIcon = ({ ability, abilityUsedAt, available, abilityKey, onClick }) => {
  const whole = ability.cooldown;
  const part = Date.now() - abilityUsedAt
  const disabled = (whole > part || !available) ? 'disabled' : ''
  return (
    <div className="abilityIcon" onClick={onClick}>
      {available && <PieChart width={46} height={46}>
          <Pie
            data={[{name: 'cooldown', value: 1}]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={15}
            activeIndex={0}
            startAngle={0}
            endAngle={calculateAngle(part, whole)}
            outerRadius={17}
            fill={'#2c66b2'}
            stroke={'#2c66b2'}
            text={'hp'}
          >
        </Pie>
      </PieChart>}
      <img src={ability.image} className={`icon ${disabled}`} alt="ability icon"/>
      <div className="abilityIconKey">{abilityKey.toUpperCase()}</div>
    </div>
  );
};
