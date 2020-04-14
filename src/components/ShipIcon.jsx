import React from 'react';
import {SHIPS} from '../constants/ships.js';

export const ShipIcon = ({shipIndex, className}) => {
  return <img className={className} src={SHIPS[shipIndex].image} alt="ship" />
};
