import React from 'react'
import '../styles/selectionModal.css'
import fighterShip from '../images/fighterShip.png';
import {Ship} from './Ship';
import {Weapon} from './Weapon';
import {SHIPS, WEAPONS} from '../constants/settings.js';

const handleClick = (ship, updateState, handleGameEvent, userId, weapon) => {
  handleGameEvent({
    id: userId,
    gameEvent: 'start',
    hitpoints: ship.hitpoints,
    maxHitpoints: ship.hitpoints,
    armor: ship.armor,
    lives: 3,
    shipIndex: ship.index,
    weaponIndex: weapon.index
  });
  updateState({currentPlayerId: userId, showSelectionModal: false});
};

const renderOptions = (updateState, selectedShipIndex, activeTab, selectedWeaponIndex) => {
  if (activeTab === 'Ship') {
    return [fighterShip, fighterShip, fighterShip, fighterShip].map((imageSrc, index) => {
      return (
        <Ship
          index={index}
          key={`ship${index}`}
          imageSrc={imageSrc}
          updateState={updateState}
          selectedShipIndex={selectedShipIndex}
          ship={SHIPS[index]}
        />
      )
    });
  };
  if (activeTab === 'Weapons') {
    return WEAPONS.map((weapon, index) => {
      return (
        <Weapon
          index={index}
          key={`weapon${index}`}
          imageSrc={weapon.selectionImage}
          updateState={updateState}
          selectedWeaponIndex={selectedWeaponIndex}
          weapon={weapon}
        />
      )
    });
  }
};

const renderStart = (ship, updateState, handleGameEvent, userId, weapon) => {
  if (ship) {
    return (
      <div className="selectionButton"
        onClick={() => handleClick(ship, updateState, handleGameEvent, userId, weapon)}>
        Start
      </div>
    );
  } else {
    return null;
  }
}

const renderTabs = (activeTab, updateState) => {
  return ['Ship', 'Weapons', 'Armor', 'Hitpoints'].map((tab, index) => {
    return (
      <div className={`selectionText ${activeTab === tab ? 'activeTab' : ''}`}
        key={`tabs${index}`}
        onClick={() => updateState({activeTab: tab})}>
          {tab}
      </div>
    );
  });
};

const SelectionModal = ({showSelectionModal, updateState, handleGameEvent, selectedShipIndex, userId, activeTab, selectedWeaponIndex}) => {
  return (
    <div className='selectionModal' hidden={!showSelectionModal}>
      <div className="modalTabs">
        {renderTabs(activeTab, updateState)}
      </div>
      {renderOptions(updateState, selectedShipIndex, activeTab, selectedWeaponIndex)}
      {renderStart(SHIPS[selectedShipIndex], updateState, handleGameEvent, userId, WEAPONS[selectedWeaponIndex])}
    </div>
  );
};

export default SelectionModal;
