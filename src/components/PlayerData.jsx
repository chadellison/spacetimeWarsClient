import React from 'react';
import '../styles/playerData.css';
import { WEAPONS } from '../constants/weapons.js';
import { UPGRADES } from '../constants/upgrades.js';
import { ABILITIES } from '../constants/abilities.js';
import goldIcon from '../images/gold.png';
import { Hitpoints } from './Hitpoints';
import { PlayerItems } from './PlayerItems';
import { PlayerStat } from './PlayerStat';
import { AbilityIcon } from './AbilityIcon';
import { LevelUpIcon } from './LevelUpIcon';
import { GameButton } from './GameButton';
import { SHIPS } from '../constants/ships';
import { round } from '../helpers/mathHelpers';
import { startEventPayload } from '../helpers/sendEventHelpers';
import { handleAbilityEvent } from '../helpers/sendEventHelpers';

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
    if (player.effects[2]) {
      modifier -= (player.velocity - 1);
    }
    if (player.effects[9]) {
      modifier += 4;
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

    if (player.effects[3]) {
      modifier -= round((damage + modifier) / 2)
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
  } else if (!modal) {
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
  modal,
  abilityData,
  activePlayer,
  handleGameEvent,
  clockDifference,
  updateState
}) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  let countDown = 0;
  if (!activePlayer.active && elapsedSeconds < 10) {
    countDown = round(10 - elapsedSeconds);
  }
  const { gold } = activePlayer;
  return (
    <div className={`playerData column ${!activePlayer.active ? 'waiting' : ''}`} onMouseEnter={() => console.log('hellllloooooo')}>
      <div>
        {activePlayer.updatedAt && handlePlayerIcon(activePlayer, countDown, modal, handleGameEvent)}
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
