import React from 'react';
import '../styles/shipIcon.css';
import {SHIPS} from '../constants/ships.js';

export const ShipIcon = ({shipIndex}) => {
  let image = SHIPS[shipIndex].image
  return (
    <img className="playerShip"
      src={image}
      alt="ship"
    />
  );
};
