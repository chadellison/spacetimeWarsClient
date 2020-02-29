import React from 'react'
import '../styles/ship.css'

export const Ship = ({updateState, imageSrc, index, selectedShipIndex, ship}) => {
  return (
    <div className={`selection ${selectedShipIndex === index ? 'selected' : ''}`}
      onClick={() => updateState({shipIndex: ship.index})}>
        <img id={index} src={imageSrc} alt="ship" className="selectionImage"/>
        <div className="selectionData">
          {`${ship.name}`}
        </div>
        <div className="selectionData">
          {`Price: ${ship.price}`}
        </div>
        <div className="selectionData">
          {`Hitpoints: ${ship.hitpoints}`}
        </div>
        <div className="selectionData">
          {`Armor: ${ship.armor}`}
        </div>
        <div className="selectionData">
          {`Speed: ${ship.speed}`}
        </div>
    </div>
  );
};
