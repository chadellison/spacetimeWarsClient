import React from 'react';
import '../styles/modal.css';
import {Ship} from './Ship';
import {Weapon} from './Weapon';
import {Upgrade} from './Upgrade';
import {Item} from './Item';
import {GameButton} from './GameButton';
import {PaginateButton} from './PaginateButton';
import {ITEMS} from '../constants/items.js';
import {SHIPS} from '../constants/ships.js';
import {WEAPONS} from '../constants/weapons.js';
import {UPGRADES} from '../constants/upgrades.js';
import {startEventPayload} from '../helpers/sendEventHelpers.js';

const handleClick = (updateState, handleGameEvent, currentPlayer) => {
  let player;
  if (currentPlayer.gameEvent === 'waiting') {
    player = startEventPayload(currentPlayer);
  } else {
    player = {...currentPlayer, gameEvent: 'shop'}
  }
  handleGameEvent(player);
  updateState({currentPlayer: player, modal: null, activeTab: 'Ships'});
};

const renderOptions = (activeTab, page, currentPlayer, players, updateState) => {
  switch (activeTab) {
    case 'Ships':
      const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
      return ships.map((ship) => {
        return (
          <Ship
            key={`ship${ship.index}`}
            imageSrc={ship.image}
            currentPlayer={currentPlayer}
            ship={ship}
            updateState={updateState}
            players={players}
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
            weapon={weapon}
            currentPlayer={currentPlayer}
            players={players}
            updateState={updateState}
          />
        )
      });
    case 'Upgrades':
      return UPGRADES.map((upgrade) => {
        return (
          <Upgrade
            key={`upgrade${upgrade.index}`}
            imageSrc={upgrade.image}
            upgrade={upgrade}
            currentPlayer={currentPlayer}
            players={players}
            updateState={updateState}
          />
        )
      });
    case 'Items':
      return ITEMS.map((item) => {
        return (
          <Item
            key={`item${item.index}`}
            imageSrc={item.image}
            item={item}
            currentPlayer={currentPlayer}
            players={players}
            updateState={updateState}
          />
        )
      });
    default:
      return null;
  }
};

const renderStart = (updateState, handleGameEvent, currentPlayer) => {
  if (currentPlayer.shipIndex !== undefined && currentPlayer.weaponIndex !== undefined && currentPlayer.gameEvent !== 'remove') {
    return (
      <GameButton
        className={'selectionButton'}
        onClick={() => handleClick(updateState, handleGameEvent, currentPlayer)}
        buttonText={'Start'}
      />
    );
  } else {
    return null;
  };
};

const renderTabs = (activeTab, updateState, currentPlayer) => {
  let tabs = ['Ships'];
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
  updateState,
  handleGameEvent,
  activeTab,
  page,
  currentPlayer,
  players
}) => {
  return (
    <div className="modal">
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, currentPlayer)}
      </div>
      {renderStart(updateState, handleGameEvent, currentPlayer)}
      {renderOptions(activeTab, page, currentPlayer, players, updateState)}
      <PaginateButton updateState={updateState} page={page} activeTab={activeTab} />
    </div>
  );
};

export default SelectionModal;
