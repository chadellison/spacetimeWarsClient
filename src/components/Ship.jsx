import React from 'react'
import '../styles/ship.css'
import {SHIPS} from '../constants/settings.js';

export const Ship = ({updateState, imageSrc, index, selectedShip}) => {
  const ship = SHIPS[index];
  // should switch tab to weapons after ship selection
  return (
    <div className={`shipSelection ${selectedShip && selectedShip.index === index ? 'selected' : ''}`}
      onClick={() => updateState({ship: ship})}>
        <img id={index} src={imageSrc} alt="ship" className="shipImage"/>
        <div className="shipData">
          {`Price: ${ship.price}`}
        </div>
        <div className="shipData">
          {`Hitpoints: ${ship.hitpoints}`}
        </div>
        <div className="shipData">
          {`Armor: ${ship.armor}`}
        </div>
        <div className="shipData">
          {`Speed: ${ship.speed}`}
        </div>
    </div>
  );
};
