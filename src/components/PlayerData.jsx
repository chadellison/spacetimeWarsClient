import React from "react";
import '../styles/playerData.css';
import {WEAPONS} from '../constants/weapons.js';
import {UPGRADES} from '../constants/upgrades.js';
import {ABILITIES} from '../constants/abilities.js';
import goldIcon from "../images/gold.png";
import {Hitpoints} from './Hitpoints';
import {PlayerItems} from './PlayerItems';
import {PlayerStat} from './PlayerStat';
import {AbilityIcon} from './AbilityIcon';
import {GameButton} from './GameButton';
import {SHIPS} from '../constants/ships';
import {round} from '../helpers/mathHelpers';
import {startEventPayload} from '../helpers/sendEventHelpers';

const renderWeapon = (weaponIndex) => {
  if (weaponIndex || weaponIndex === 0) {
    return (
      <img
        className="playerInfoWeapon"
        src={WEAPONS[weaponIndex].selectionImage}
        alt="weapon"
      />
    )
  }
}

const renderArmor = (player) => {
  if (player.armor >= 0) {
    let modifier;
    if (player.effects[8]) {
      modifier = '+4';
    }
    return (
      <PlayerStat
        image={UPGRADES[0].image}
        alt={'shield'}
        value={player.armor}
        className="statInfo"
        modifier={modifier}
      />
    )
  }
}
const renderSpeed = (player) => {
  if (player.velocity) {
    let modifier;
    if (player.effects[2]) {
      modifier = '-' + (player.velocity - 1).toString()
    } else if (player.effects[9]) {
      modifier = '+4';
    }
    return (
      <PlayerStat
        image={UPGRADES[2].image}
        alt={'speedometer'}
        value={player.velocity}
        className="statInfo"
        modifier={modifier}
      />
    )
  }
}

const renderDamage = (player) => {
  if (player.damage) {
    let modifier;
    if (player.effects[11]) {
      modifier = '+' + round(player.damage * 0.25)
    }
    return (
      <PlayerStat
        image={UPGRADES[3].image}
        alt={'target'}
        value={player.damage}
        className="statInfo"
        modifier={modifier}
      />
    )
  }
}

const handlePlayerIcon = (activePlayer, countDown, modal, handleGameEvent) => {
  if (activePlayer.active) {
    return (
      <img
        className="playerImage"
        src={`https://robohash.org/${activePlayer.index}?color=${activePlayer.team}`}
        alt="player"
      />
    );
  } else if (countDown > 0) {
    return <span className="waitCountDown">{countDown}</span>;
  } else if (modal !== 'selection') {
    return (
      <GameButton
        className={'startButton'}
        onClick={() => handleGameEvent(startEventPayload(activePlayer))}
        buttonText={'start'}
      />
    );
  }
}

const renderHitPoints = (activePlayer) => {
  if (activePlayer.hitpoints > 0) {
    return (
      <Hitpoints
        hitpoints={activePlayer.hitpoints}
        maxHitpoints={activePlayer.maxHitpoints}
      />
    );
  }
};

const renderAbilityIcons = (activePlayer, abilityCooldownData) => {
  if (activePlayer.shipIndex === 0 || activePlayer.shipIndex) {
    const shipAbilities = SHIPS[activePlayer.shipIndex].abilities
    return [
      {ability: ABILITIES[shipAbilities.q], key: 'q'},
      {ability: ABILITIES[shipAbilities.w], key: 'w'}
    ].map((abilityData, index) => {
      return <AbilityIcon ability={abilityData.ability} key={'abilityIcon' + index}
        abilityUsedAt={abilityCooldownData[abilityData.key]}/>
    });
  }
};

const PlayerData = ({
  activePlayer,
  clockDifference,
  updateState,
  defenseData,
  abilityCooldownData,
  modal,
  handleGameEvent
}) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  let countDown = 0;
  if (!activePlayer.active && elapsedSeconds < 10) {
    countDown = round(10 - elapsedSeconds);
  }

  const {gold} = activePlayer;
  return (
    <div className={`playerData column ${!activePlayer.active ? 'waiting' : ''}`}>
      <div className="row">
        {activePlayer.updatedAt && handlePlayerIcon(activePlayer, countDown, modal, handleGameEvent)}
        <div className="nameInfo">{activePlayer.name}</div>
        {gold >= 0 && <PlayerStat image={goldIcon} alt={'gold'} value={gold} className="goldInfo"/>}
        {renderHitPoints(activePlayer)}
        {renderWeapon(activePlayer.weaponIndex)}
        {renderAbilityIcons(activePlayer, abilityCooldownData)}
        {renderDamage(activePlayer)}
        {renderArmor(activePlayer)}
        {renderSpeed(activePlayer)}
        <div className="ScoreInfo">{`Score: ${activePlayer.score}`}</div>
        <PlayerItems items={activePlayer.items} />
        <div className="defenseData">Defenses</div>
        <div className="redDefenseData">{defenseData.red}</div>
        <div className="blueDefenseData">{defenseData.blue}</div>
      </div>
    </div>
  );
}

export default PlayerData;
