import React from 'react'
import '../styles/selectionModal.css'
import {Ship} from './Ship';
import {Weapon} from './Weapon';
import {PaginateButton} from './PaginateButton';
import {SHIPS, WEAPONS} from '../constants/settings.js';

const handleClick = (updateState, handleGameEvent, waitingPlayer) => {
  const ship = SHIPS[waitingPlayer.shipIndex];
  const weapon = WEAPONS[waitingPlayer.weaponIndex];

  handleGameEvent({
    id: waitingPlayer.id,
    gameEvent: 'start',
    hitpoints: ship.hitpoints,
    maxHitpoints: ship.hitpoints,
    armor: ship.armor,
    lives: 3,
    shipIndex: ship.index,
    weaponIndex: weapon.index,
    velocity: ship.speed,
    gold: waitingPlayer.gold,
    score: waitingPlayer.score
  });
  updateState({currentPlayerId: waitingPlayer.id, showSelectionModal: false});
};

const renderOptions = (updateState, activeTab, page, waitingPlayer) => {
  if (activeTab === 'Ship') {
    const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
    return ships.map((ship) => {
      return (
        <Ship
          key={`ship${ship.index}`}
          imageSrc={ship.image}
          updateState={updateState}
          waitingPlayer={waitingPlayer}
          ship={ship}
        />
      )
    });
  };
  if (activeTab === 'Weapons') {
    const weapons = page === 1 ? WEAPONS.slice(0, 4) : WEAPONS.slice(4, 8);
    return weapons.map((weapon) => {
      return (
        <Weapon
          key={`weapon${weapon.index}`}
          imageSrc={weapon.selectionImage}
          updateState={updateState}
          waitingPlayer={waitingPlayer}
          weapon={weapon}
        />
      )
    });
  }
};

const renderStart = (updateState, handleGameEvent, waitingPlayer) => {
  if (waitingPlayer.shipIndex !== undefined && waitingPlayer.weaponIndex !== undefined) {
      return (
        <div className="selectionButton"
          onClick={() => handleClick(updateState, handleGameEvent, waitingPlayer)}>
          Start
        </div>
      );
  } else {
    return null;
  };
};

const renderTabs = (activeTab, updateState, waitingPlayer) => {
  let tabs = ['Ship'];
  if (waitingPlayer.shipIndex || waitingPlayer.shipIndex === 0) {
    tabs.push('Weapons');
  };
  if (waitingPlayer.weaponIndex || waitingPlayer.weaponIndex === 0) {
    tabs.push('Armor');
    tabs.push('Hitpoins');
  };
  return tabs.map((tab, index) => {
    return (
      <div className={`selectionText ${activeTab === tab ? 'activeTab' : ''}`}
        key={`tabs${index}`}
        onClick={() => updateState({activeTab: tab, page: 1})}>
          {tab}
      </div>
    );
  });
};

const SelectionModal = ({
  showSelectionModal,
  updateState,
  handleGameEvent,
  activeTab,
  page,
  waitingPlayer
}) => {
  return (
    <div className='selectionModal'>
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, waitingPlayer)}
      </div>
      {renderStart(updateState, handleGameEvent, waitingPlayer)}
      {renderOptions(updateState, activeTab, page, waitingPlayer)}
      <PaginateButton updateState={updateState} page={page}/>
    </div>
  );
};

export default SelectionModal;
