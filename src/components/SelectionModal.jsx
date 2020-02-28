import React from 'react'
import '../styles/selectionModal.css'
import fighterShip from '../images/fighterShip.png';
import {Ship} from './Ship';

const handleClick = (selectedShip, updateState, handleGameEvent, userId) => {
  handleGameEvent({
    id: userId,
    gameEvent: 'start',
    hitpoints: 1000,
    maxHitpoints: 1000,
    armor: 1,
    lives: 3,
    ship: selectedShip
  });
  updateState({currentPlayerId: userId, showSelectionModal: false});
};

const renderShips = (updateState, selectedShip) => {
  return [fighterShip, fighterShip, fighterShip, fighterShip].map((imageSrc, index) => {
    return (
      <Ship
        index={index}
        key={`ship${index}`}
        imageSrc={imageSrc}
        updateState={updateState}
        selectedShip={selectedShip}
      />
    )
  });
};

const renderStart = (ship, updateState, handleGameEvent, userId) => {
  // if ship and weapon...?
  if (ship) {
    return (
      <div className="selectionButton"
        onClick={() => handleClick(ship, updateState, handleGameEvent, userId)}>
        Start
      </div>
    );
  } else {
    return null;
  }
}

const SelectionModal = ({showSelectionModal, updateState, handleGameEvent, selectedShip, userId}) => {
  return (
    <div className='selectionModal' hidden={!showSelectionModal}>
      <div className=''>
        <div className='selectionText'>{'Select a Ship'}</div>
        {renderShips(updateState, selectedShip)}
        {renderStart(selectedShip, updateState, handleGameEvent, userId)}
      </div>
    </div>
  );
};

export default SelectionModal;
