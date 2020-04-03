import React from 'react';
import {SHIPS} from '../constants/ships.js';

export const ShipIcon = ({shipIndex, className}) => {
  if (shipIndex) {
    return <img className={className} src={SHIPS[shipIndex].image} alt="ship" />
  } else {
    return null;
  }
};
