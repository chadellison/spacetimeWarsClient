import React, { useState } from 'react';
import { ITEMS } from '../constants/items.js';
import { SHIPS } from '../constants/ships.js';
import { UPGRADES } from '../constants/upgrades.js';
import { WEAPONS } from '../constants/weapons.js';
import { startEventPayload } from '../helpers/sendEventHelpers.js';
import goldIcon from '../images/goldIcon2.png';
import '../styles/modal.css';
import { GameButton } from './GameButton';
import { Item } from './Item';
import { PaginateButton } from './PaginateButton';
import { Ship } from './Ship';
import { Upgrade } from './Upgrade';
import { Weapon } from './Weapon';

const handleClick = (updateState, handleGameEvent, activePlayer) => {
  if (activePlayer.gameEvent === 'waiting') {
    handleGameEvent(startEventPayload(activePlayer));
  } else {
    handleGameEvent({ ...activePlayer, gameEvent: 'shop' });
  }
  updateState({ modal: null, activeTab: 'Ships', page: 1 });
};

const PAGE_SIZE = 4;

const renderOptions = (activeTab, page, activePlayer, updateState, players, upgrades, experiencePoints, hover, setHover) => {
  const end = page * PAGE_SIZE;
  const start = end - PAGE_SIZE;
  switch (activeTab) {
    case 'Ships':
      return (
        <div>
          {
            SHIPS.slice(start, end).map(ship => {
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
                />
              )
            })
          }
        </div>
      );
    case 'Weapons':
      return (
        <div>
          {
            WEAPONS.slice(start, end).map(weapon => (
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
            ))
          }
        </div>
      );
    case 'Upgrades':
      return (
        <div>
          {
            UPGRADES.map((upgrade) => {
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
            })
          }
        </div>
      );
    case 'Items':
      return (
        <div className="gameItemsContainer">
          {
            ITEMS.map(item => {
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
                />
              )
            })
          }
        </div>
      );
    default:
      return null;
  }
};

const renderStart = (updateState, handleGameEvent, activePlayer, clockDifference) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  if (activePlayer.shipIndex !== undefined && activePlayer.weaponIndex !== undefined) {
    if (elapsedSeconds > 10) {
      return (
        <GameButton
          className={'selectionButton'}
          onClick={() => handleClick(updateState, handleGameEvent, activePlayer)}
          buttonText={'start'}
        />
      );
    } else {
      return (
        <GameButton
          className={'selectionButton'}
          onClick={() => updateState({ modal: null })}
          buttonText={'exit'}
        />
      );
    }
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

const renderGold = (goldValue) => (
  <div className="goldContainer">
    <img src={goldIcon} alt="gold icon" className="goldIcon" />
    {goldValue}
  </div>
);

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
  const [hover, setHover] = useState(null);

  const { gold } = activePlayer;

  return (
    <div className="modal">
      <div className="modalTabs">
        {renderTabs(activeTab, updateState, activePlayer)}
      </div>
      {renderGold(gold)}
      {renderStart(updateState, handleGameEvent, activePlayer, clockDifference)}
      {activeTab === 'Upgrades' && <div className="experiencePoints">{'Experience points ' + experiencePoints}</div>}
      {renderOptions(activeTab, page, activePlayer, updateState, players, upgrades, experiencePoints, hover, setHover)}
      <div className="description">
      </div>
      {['Ships', 'Weapons'].includes(activeTab) && <PaginateButton updateState={updateState} page={page} activeTab={activeTab} />}
    </div>
  );
}
