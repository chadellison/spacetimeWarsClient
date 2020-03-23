import React from 'react';
import '../styles/modal.css';

export const InformationModal = ({updateState}) => {
  return (
    <div className='selectionModal'>
      <div className="informationTitle">How to play</div>
        <div className="informationText">Press any key to start or click the Start button</div>
        <div className="informationText">Select a Ship from the menu</div>
        <div className="informationText">Select a weapon</div>
        <div className="informationText">Click "start" to begin playing.</div>
      <div className="informationTitle">Controls</div>
      <div className="informationText">
        <span className="instructionControl">"Up":</span> accelerate
      </div>
      <div className="informationText">
        <span className="instructionControl">"Left":</span> rotate left
      </div>
      <div className="informationText">
        <span className="instructionControl">"Right":</span> rotate right
      </div>
      <div className="informationText">
        <span className="instructionControl">"Space":</span> fire weapon
      </div>
      <div className="noteText">Note the other tabs, "Upgrades" and "Items". As you collect more gold you</div>
      <div className="noteText">may return to this menu at any time to purchase ships, weapons, upgrades and items.</div>
      <div className="noteText">Information about each is listed below the icon (price, description, etc.).</div>
      <div className="noteText">After selecting a ship and a weapon the "start" button will appear.</div>
      <div className="closeButton" onClick={() => updateState({modal: null})}>Close</div>
    </div>
  );
};
