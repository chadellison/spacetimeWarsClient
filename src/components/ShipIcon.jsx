import React from 'react';
import {SHIPS} from '../constants/ships.js';

export const ShipIcon = ({shipIndex, className, team}) => {
  let image = SHIPS[shipIndex].image;
  if (team === 'blue') {
    image = SHIPS[shipIndex].blueImage
  };
  return <img className={className} src={image} alt="ship" />
};
