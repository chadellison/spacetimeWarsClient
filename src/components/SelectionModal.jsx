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
import {handleGameEvent} from '../gameSocket.js';

const handleClick = (modal, updateModalAction, activePlayer) => {
  if (activePlayer.gameEvent === 'waiting') {
    handleGameEvent(startEventPayload(activePlayer));
  } else {
    handleGameEvent({...activePlayer, gameEvent: 'shop'})
  }
  updateModalAction({...modal, display: null, activeTab: 'Ships'});
};

const renderOptions = (modal, activePlayer, user, players) => {
  switch (modal.activeTab) {
    case 'Ships':
      const ships = page === 1 ? SHIPS.slice(0, 4) : SHIPS.slice(4, 8);
      return ships.map((ship) => {
        return (
          <Ship
            key={`ship${ship.index}`}
            imageSrc={activePlayer.team === 'red' ? ship.image : ship.blueImage }
            activePlayer={activePlayer}
            ship={ship}
            index={user.index}
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
            activePlayer={activePlayer}
            index={user.index}
            players={players}
          />
        )
      });
    case 'Upgrades':
      return UPGRADES.map((upgrade) => {
        return (
          <Upgrade
            index={user.index}
            upgrade={upgrade}
            players={players}
            upgrades={upgrades}
            imageSrc={upgrade.image}
            activePlayer={activePlayer}
            key={`upgrade${upgrade.index}`}
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
            index={user.index}
            players={players}
          />
        )
      });
    default:
      return null;
  }
};

const renderStart = (modal, updateModalAction, activePlayer, clockDifference) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  if (activePlayer.shipIndex !== undefined && activePlayer.weaponIndex !== undefined && elapsedSeconds > 10) {
    return (
      <GameButton
        className={'selectionButton'}
        onClick={() => handleClick(modal, updateModalAction, activePlayer)}
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

const renderTabs = (modal, updateModalAction, activePlayer) => {
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
      <div className={`selectionText ${modal.activeTab === tab ? 'activeTab' : ''}`}
        key={`tabs${index}`}
        onClick={() => updateModalAction({...modal, activeTab: tab, page: 1})}>
          {tab}
      </div>
    );
  });
};

export const SelectionModal = ({modal, user, players, time}) => {
  const activePlayer = user.index !== null ? players[user.index] : user.startingPlayer;
  return (
    <div className="modal">
      <div className="modalTabs">
        {renderTabs(modal, updateModalAction, activePlayer)}
      </div>
      {renderStart(modal, updateModalAction, activePlayer, time.clockDifference)}
      {renderOptions(modal, activePlayer, user, players)}
      <PaginateButton updateState={updateState} page={page} activeTab={activeTab} />
    </div>
  );
};

const mapStateToProps = ({modal, user, players, time}) => {
  return { modal, user, time, players };
}

const mapDispatchToProps = dispatch => {
  return { updateModalAction }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionModal)
