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
import {findElapsedTime} from '../helpers/gameLogic.js';

const handleClick = (updateState, handleGameEvent, activePlayer) => {
  if (activePlayer.gameEvent === 'waiting') {
    handleGameEvent(startEventPayload(activePlayer));
  } else {
    handleGameEvent({...activePlayer, gameEvent: 'shop'})
  }
  updateState({modal: null, activeTab: 'Ships'});
};

const renderOptions = (activeTab, page, activePlayer, updateState, index, players) => {
  switch (activeTab) {
    case 'Ships':
      const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
      return ships.map((ship) => {
        return (
          <Ship
            key={`ship${ship.index}`}
            imageSrc={activePlayer.team === 'red' ? ship.image : ship.blueImage }
            activePlayer={activePlayer}
            ship={ship}
            index={index}
            players={players}
            updateState={updateState}
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
            activePlayer={activePlayer}
            index={index}
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
            activePlayer={activePlayer}
            index={index}
            players={players}
            updateState={updateState}
          />
        )
      });
    case 'Items':
      const items = page === 1 ? ITEMS.slice(0, 4) : ITEMS.slice(4, 8);
      return items.map((item) => {
        return (
          <Item
            key={`item${item.index}`}
            imageSrc={item.image}
            item={item}
            activePlayer={activePlayer}
            index={index}
            players={players}
            updateState={updateState}
          />
        )
      });
    default:
      return null;
  }
};

const renderStart = (updateState, handleGameEvent, activePlayer, clockDifference) => {
  const elapsedSeconds = findElapsedTime(clockDifference, activePlayer.explodedAt) / 1000;

  if (activePlayer.shipIndex !== undefined && activePlayer.weaponIndex !== undefined && elapsedSeconds > 10) {
    return (
      <GameButton
        className={'selectionButton'}
        onClick={() => handleClick(updateState, handleGameEvent, activePlayer)}
        buttonText={'Start'}
      />
    );
  } else {
    return null;
  };
};

const renderTabs = (activeTab, updateState, activePlayer) => {
  let tabs = ['Ships'];
  if (activePlayer.shipIndex || activePlayer.shipIndex === 0) {
    tabs.push('Weapons');
  };
  if (activePlayer.weaponIndex || activePlayer.weaponIndex === 0) {
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

export const SelectionModal = ({
  page,
  index,
  players,
  activeTab,
  updateState,
  activePlayer,
  clockDifference,
  handleGameEvent,
}) => {
  return (
    <div className="modal">
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, activePlayer)}
      </div>
      {renderStart(updateState, handleGameEvent, activePlayer, clockDifference)}
      {renderOptions(activeTab, page, activePlayer, updateState, index, players)}
      <PaginateButton updateState={updateState} page={page} activeTab={activeTab} />
    </div>
  );
};
