import React from 'react';
import {PieChart, Pie, Label} from 'recharts'
import '../styles/hitpoints.css';

const calculateAngle = (hitpoints, maxHitpoints) => {
  const value = Math.round(hitpoints * 360 / maxHitpoints)
  return value > 0 ? value : 0;
};

export const Hitpoints = ({hitpoints, maxHitpoints}) => {
  return (
    <div className="hitpoints">
      <PieChart width={100} height={100}>
        <Pie
          data={[{name: 'Hitpoints', value: 1}]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={35}
          activeIndex={0}
          startAngle={0}
          endAngle={calculateAngle(hitpoints, maxHitpoints)}
          outerRadius={40}
          fill="red"
          text={'hp'}
        >
          <Label style={{fill: 'red'}} value={hitpoints > 0 ? hitpoints : 0} offset={0} position="center"/>
        </Pie>
      </PieChart>
    </div>
  );
};