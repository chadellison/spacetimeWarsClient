import React from 'react'
import '../styles/selectionModal.css'
import {startEventPayload} from '../helpers/sendEventHelpers.js'
import {Ship} from './Ship';
import {Weapon} from './Weapon';
import {Upgrade} from './Upgrade';
import {Item} from './Item';
import {PaginateButton} from './PaginateButton';
import {SHIPS, WEAPONS, UPGRADES, ITEMS} from '../constants/settings.js';

const handleClick = (updateState, handleGameEvent, currentPlayer) => {
  const player = startEventPayload(currentPlayer);
  handleGameEvent(player);
  updateState({currentPlayer: player, showSelectionModal: false});
};

const renderOptions = (updateState, activeTab, page, currentPlayer) => {
  switch (activeTab) {
    case 'Ship':
      const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
      return ships.map((ship) => {
        return (
          <Ship
            key={`ship${ship.index}`}
            imageSrc={ship.image}
            updateState={updateState}
            currentPlayer={currentPlayer}
            ship={ship}
          />
        )
      });
    case 'Weapons':
      const weapons = page === 1 ? WEAPONS.slice(0, 4) : WEAPONS.slice(4, 8);
      return weapons.map((weapon) => {
        return (
          <Weapon
            key={`weapon${weapon.index}`}
            imageSrc={weapon.selectionImage}
            updateState={updateState}
            currentPlayer={currentPlayer}
            weapon={weapon}
          />
        )
      });
    case 'Upgrades':
      return UPGRADES.map((upgrade) => {
        return (
          <Upgrade
            key={`upgrade${upgrade.index}`}
            imageSrc={upgrade.image}
            updateState={updateState}
            currentPlayer={currentPlayer}
            upgrade={upgrade}
          />
        )
      });
    case 'Items':
      return ITEMS.map((item) => {
        return (
          <Item
            key={`item${item.index}`}
            imageSrc={item.image}
            updateState={updateState}
            currentPlayer={currentPlayer}
            item={item}
          />
        )
      });
    default:
      return null;
  }
};

const renderStart = (updateState, handleGameEvent, currentPlayer) => {
  if (currentPlayer.shipIndex !== undefined && currentPlayer.weaponIndex !== undefined) {
    return (
      <div className="selectionButton"
        onClick={() => handleClick(updateState, handleGameEvent, currentPlayer)}>
        Start
      </div>
    );
  } else {
    return null;
  };
};

const renderTabs = (activeTab, updateState, currentPlayer) => {
  let tabs = ['Ship'];
  if (currentPlayer.shipIndex || currentPlayer.shipIndex === 0) {
    tabs.push('Weapons');
  };
  if (currentPlayer.weaponIndex || currentPlayer.weaponIndex === 0) {
    tabs.push('Upgrades');
    tabs.push('Items');
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
  currentPlayer
}) => {
  return (
    <div className='selectionModal'>
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, currentPlayer)}
      </div>
      {renderStart(updateState, handleGameEvent, currentPlayer)}
      {renderOptions(updateState, activeTab, page, currentPlayer)}
      <PaginateButton updateState={updateState} page={page}/>
    </div>
  );
};

export default SelectionModal;
