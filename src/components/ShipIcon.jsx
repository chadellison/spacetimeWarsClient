import React from 'react';
import {SHIPS} from '../constants/ships.js';

export const ShipIcon = ({shipIndex, className}) => {
  let image = SHIPS[shipIndex].image
  return (
    <img className={className}
      src={image}
      alt="ship"
    />
  );
};
