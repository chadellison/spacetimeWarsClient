import React from 'react';
import { SHIPS } from '../constants/ships.js';

export const ShipIcon = ({ shipIndex, className, team }) => {
  const ship = SHIPS[shipIndex];
  if (ship) {
    const image = team === 'blue' ? ship.blueImage : ship.image;
    return <img className={className} src={image} alt="ship" />
  }
};
