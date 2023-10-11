import React from 'react';
import { API_RESOURCE_URL } from '../api/apiHelpers.js';
import { ABILITIES } from '../constants/abilities.js';
import { PILOTS } from '../constants/pilots';
import { SHIPS } from '../constants/ships';
import { UPGRADES } from '../constants/upgrades.js';
import { WEAPONS } from '../constants/weapons.js';
import { round } from '../helpers/mathHelpers';
import { playerCountDown } from '../helpers/playerHelpers';
import { handleAbilityEvent } from '../helpers/sendEventHelpers';
import goldIcon from '../images/gold.png';
import '../styles/playerData.css';
import { AbilityIcon } from './AbilityIcon';
import { Hitpoints } from './Hitpoints';
import { LevelUpIcon } from './LevelUpIcon';
import { PlayerItems } from './PlayerItems';
import { PlayerStat } from './PlayerStat';

const renderWeapon = (weaponIndex) => {
  if (weaponIndex >= 0) {
    return (
      <img
        className="playerDataWeapon"
        src={WEAPONS[weaponIndex].selectionImage}
        alt="weapon"
      />
    )
  }
}

const renderArmor = (player) => {
  if (player.armor >= 0) {
    let modifier = 0;
    if (player.effects[8]) {
      modifier += 4;
    }

    if (player.effects[12]) {
      modifier -= 3;
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
    let modifier = 0;
    
    if (player.effects[9]) {
      modifier += 4;
    }
    if (player.items[11]) {
      modifier += 3;
    }
    if (player.effects[2]) {
      modifier -= ((player.velocity + modifier) / 2);
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
  if (player.weaponIndex || player.weaponIndex === 0) {
    let damage = WEAPONS[player.weaponIndex].damage + player.damage;
    if (player.items[7]) {
      damage += round(damage * 0.8);
    }
    let modifier = 0;
    if (player.effects[11]) {
      modifier += round(damage * 0.25);
    }

    return (
      <PlayerStat
        image={UPGRADES[3].image}
        alt={'target'}
        value={damage}
        className="statInfo"
        modifier={modifier}
      />
    )
  }
}

const handlePlayerIcon = (activePlayer, countDown) => {
    return (
      <>
        <img
          className={activePlayer.active ? 'playerImage' : 'playerImage inactive'}
          src={`${API_RESOURCE_URL}/${PILOTS[activePlayer.shipIndex]}`}
          alt="player"
        />
        {countDown > 0 && <span className="waitCountDown">{countDown}</span>}
      </>
    );
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

const renderAbility = (activePlayer, playerAbilityData, handleGameEvent, updateState) => {
  if (activePlayer.shipIndex === 0 || activePlayer.shipIndex) {
    const shipAbilities = SHIPS[activePlayer.shipIndex].abilities;
    const levelSum = playerAbilityData.q.level + playerAbilityData.w.level + playerAbilityData.e.level;

    const hasLevelPoints = activePlayer.level > levelSum;
    return [
      { ability: ABILITIES[shipAbilities.q], key: 'q' },
      { ability: ABILITIES[shipAbilities.w], key: 'w' },
      { ability: ABILITIES[shipAbilities.e], key: 'e' },
    ].map((abilityData, index) => {

      const abilityLevel = playerAbilityData[abilityData.key].level;
      if (hasLevelPoints && abilityLevel < 3) {
        return (
          <LevelUpIcon
            onClick={() => activePlayer.active && handleAbilityEvent(activePlayer, { ...playerAbilityData }, handleGameEvent, updateState, abilityData.key)}
            ability={abilityData.ability}
            key={'abilityIcon' + index}
            abilityKey={abilityData.key}
            abilityLevel={abilityLevel}
          />
        )
      } else {
        return (
          <AbilityIcon
            onClick={() => activePlayer.active && handleAbilityEvent(activePlayer, { ...playerAbilityData }, handleGameEvent, updateState, abilityData.key)}
            ability={abilityData.ability}
            key={'abilityIcon' + index}
            abilityKey={abilityData.key}
            available={playerAbilityData[abilityData.key].level > 0}
            abilityUsedAt={playerAbilityData[abilityData.key].lastUsed}
          />
        )
      };
    });
  }
};

const PlayerData = ({
  abilityData,
  activePlayer,
  handleGameEvent,
  clockDifference,
  updateState
}) => {
  const countDown = playerCountDown(activePlayer, clockDifference);

  const { gold } = activePlayer;
  return (
    <div className={`playerData column ${!activePlayer.active ? 'waiting' : ''}`}>
      <div>
        {activePlayer.updatedAt && handlePlayerIcon(activePlayer, countDown)}
        <div className="playerLevel">{'level: ' + activePlayer.level}</div>
        <div className="nameInfo">{activePlayer.name}</div>
        {gold >= 0 && <PlayerStat image={goldIcon} alt={'gold'} value={gold} className="goldInfo" />}
        {renderHitPoints(activePlayer)}
        {renderAbility(activePlayer, abilityData, handleGameEvent, updateState)}
        {renderWeapon(activePlayer.weaponIndex)}
        {renderDamage(activePlayer)}
        {renderArmor(activePlayer)}
        {renderSpeed(activePlayer)}
        <div className="ScoreInfo">{`Score: ${activePlayer.score}`}</div>
        <PlayerItems items={activePlayer.items} />
      </div>
    </div>
  );
}

export default PlayerData;
