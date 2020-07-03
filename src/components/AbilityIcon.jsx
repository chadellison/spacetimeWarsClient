import React from 'react';
import '../styles/abilityIcon.css';
import {PieChart, Pie} from 'recharts';
import {calculateAngle} from '../helpers/mathHelpers';

export const AbilityIcon = ({ability, abilityUsedAt}) => {
  const whole = ability.cooldown;
  const part = Date.now() - abilityUsedAt
  const onCoolDown = whole > part ? 'transparent' : ''
  return (
    <div className={"abilityIcon"}>
      <PieChart width={46} height={46}>
        <Pie
          data={[{name: 'stealth mode', value: 1}]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={15}
          activeIndex={0}
          startAngle={0}
          endAngle={calculateAngle(part, whole)}
          outerRadius={20}
          fill={'#2c66b2'}
          stroke={'#2c66b2'}
          text={'hp'}
        >
        </Pie>
      </PieChart>
      <img src={ability.image} className={`icon ${onCoolDown}`} alt="ability icon"/>
    </div>
  );
};
