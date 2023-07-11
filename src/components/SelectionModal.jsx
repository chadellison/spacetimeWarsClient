import React, { useState } from 'react';
import '../styles/modal.css';
import { Ship } from './Ship';
import { Weapon } from './Weapon';
import { Upgrade } from './Upgrade';
import { Item } from './Item';
import { GameButton } from './GameButton';
import { PaginateButton } from './PaginateButton';
import { ITEMS } from '../constants/items.js';
import { SHIPS } from '../constants/ships.js';
import { WEAPONS } from '../constants/weapons.js';
import { UPGRADES } from '../constants/upgrades.js';
import { startEventPayload } from '../helpers/sendEventHelpers.js';

const handleClick = (updateState, handleGameEvent, activePlayer) => {
  if (activePlayer.gameEvent === 'waiting') {
    handleGameEvent(startEventPayload(activePlayer));
  } else {
    handleGameEvent({ ...activePlayer, gameEvent: 'shop' })
  }
  updateState({ modal: null, activeTab: 'Ships' });
};

const renderOptions = (activeTab, page, activePlayer, updateState, players, upgrades, experiencePoints, updateDescription, hover, setHover) => {
  switch (activeTab) {
    case 'Ships':
      const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
      return ships.map((ship) => {
        return (
          <Ship
            key={`ship${ship.index}`}
            hover={hover}
            setHover={setHover}
            imageSrc={activePlayer.team === 'red' ? ship.image : ship.blueImage}
            activePlayer={activePlayer}
            ship={ship}
            players={players}
            updateState={updateState}
            updateDescription={updateDescription}
          />
        )
      });
    case 'Weapons':
      const weapons = page === 1 ? WEAPONS.slice(0, 4) : WEAPONS.slice(4, 8);
      return weapons.map(weapon => (
          <Weapon
            key={`weapon${weapon.index}`}
            hover={hover}
            setHover={setHover}
            imageSrc={weapon.selectionImage}
            weapon={weapon}
            activePlayer={activePlayer}
            players={players}
            updateState={updateState}
          />
      ));
    case 'Upgrades':
      return UPGRADES.map((upgrade) => {
        return (
          <Upgrade
            hover={hover}
            setHover={setHover}
            upgrade={upgrade}
            players={players}
            upgrades={upgrades}
            imageSrc={upgrade.image}
            updateState={updateState}
            activePlayer={activePlayer}
            experiencePoints={experiencePoints}
            key={`upgrade${upgrade.index}`}
          />
        )
      });
    case 'Items':
      return ITEMS.map((item) => {
        return (
          <Item
            hover={hover}
            setHover={setHover}
            key={`item${item.index}`}
            imageSrc={item.image}
            item={item}
            activePlayer={activePlayer}
            players={players}
            updateState={updateState}
            updateDescription={updateDescription}
          />
        )
      });
    default:
      return null;
  }
};

const renderStart = (updateState, handleGameEvent, activePlayer, clockDifference) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  if (activePlayer.shipIndex !== undefined && activePlayer.weaponIndex !== undefined && elapsedSeconds > 10) {
    return (
      <GameButton
        className={'selectionButton'}
        onClick={() => handleClick(updateState, handleGameEvent, activePlayer)}
        buttonText={'start'}
      />
    );
  } else if (activePlayer.shipIndex === undefined) {
    return <div className="informationText">select a ship</div>;
  } else if (activePlayer.weaponIndex === undefined) {
    return <div className="informationText">select a weapon</div>;
  } else {
    return null;
  }
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
        onClick={() => updateState({ activeTab: tab, page: 1 })}>
        {tab}
      </div>
    );
  });
};

export const SelectionModal = ({
  page,
  players,
  upgrades,
  activeTab,
  updateState,
  activePlayer,
  clockDifference,
  handleGameEvent
}) => {
  const experiencePoints = activePlayer.level - upgrades.reduce((accumulator, value) => accumulator + value, 1)
  const [description, setDesscription] = useState('');
  const [hover, setHover] = useState(null);

  return (
    <div className="modal">
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, activePlayer)}
      </div>
      {renderStart(updateState, handleGameEvent, activePlayer, clockDifference)}
      {activeTab === 'Upgrades' && <div className="experiencePoints">{'Experience points ' + experiencePoints}</div>}
      {renderOptions(activeTab, page, activePlayer, updateState, players, upgrades, experiencePoints, (description) => setDesscription(description), hover, setHover)}
      <div className="description">
        {description}
      </div>
      <PaginateButton updateState={updateState} page={page} activeTab={activeTab} />
    </div>
  );
}
