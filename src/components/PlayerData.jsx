import React from 'react';
import '../styles/playerData.css';
import {WEAPONS} from '../constants/weapons.js';
import {UPGRADES} from '../constants/upgrades.js';
import {ABILITIES} from '../constants/abilities.js';
import goldIcon from '../images/gold.png';
import {Hitpoints} from './Hitpoints';
import {PlayerItems} from './PlayerItems';
import {PlayerStat} from './PlayerStat';
import {AbilityIcon} from './AbilityIcon';
import {LevelUpIcon} from './LevelUpIcon';
import {GameButton} from './GameButton';
import {SHIPS} from '../constants/ships';
import {round} from '../helpers/mathHelpers';
import {startEventPayload} from '../helpers/sendEventHelpers';
import {handleGameEvent} from '../gameSocket.js';

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
  if (player.weaponIndex || player.weaponIndex === 0) {
    let damage = WEAPONS[player.weaponIndex].damage + player.damage;
    if (player.items[7]) {
      damage += round(damage * 0.8);
    }
    let modifier = '';
    let modifiedValue = '';
    if (player.effects[11]) {
      modifier = '+';
      modifiedValue = round(damage * 0.25);
    }

    if (player.effects[3]) {
      modifier = '-';
      modifiedValue = modifiedValue ? modifiedValue : damage;
      modifiedValue = round(modifiedValue / 2)
    }
    return (
      <PlayerStat
        image={UPGRADES[3].image}
        alt={'target'}
        value={damage}
        className="statInfo"
        modifier={modifier + modifiedValue}
      />
    )
  }
}

const handlePlayerIcon = (activePlayer, countDown, displayModal) => {
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
  } else if (!displayModal) {
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

const renderAbilityIcons = (activePlayer, playerAbilityData) => {
  if (activePlayer.shipIndex === 0 || activePlayer.shipIndex) {
    let abilityIcons = [];
    const shipAbilities = SHIPS[activePlayer.shipIndex].abilities;
    const levelSum = playerAbilityData.q.level + playerAbilityData.w.level + playerAbilityData.e.level;

    const hasLevelPoints = activePlayer.level > levelSum;
    [
      {ability: ABILITIES[shipAbilities.q], key: 'q'},
      {ability: ABILITIES[shipAbilities.w], key: 'w'},
      {ability: ABILITIES[shipAbilities.e], key: 'e'},
    ].forEach((abilityData, index) => {
      const abilityLevel = playerAbilityData[abilityData.key].level;
      if (hasLevelPoints && abilityLevel < 3) {
        abilityIcons.push(
          <LevelUpIcon
            ability={abilityData.ability}
            key={'abilityIcon' + index}
            abilityKey={abilityData.key}
            abilityLevel={abilityLevel}
          />
        )
      } else if (playerAbilityData[abilityData.key].level > 0) {
        abilityIcons.push(
          <AbilityIcon
            ability={abilityData.ability}
            key={'abilityIcon' + index}
            abilityKey={abilityData.key}
            available={playerAbilityData[abilityData.key].level > 0}
            abilityUsedAt={playerAbilityData[abilityData.key].lastUsed}
          />
        )
      };
    });
    return abilityIcons;
  }
};

const PlayerData = ({
  game,
  time,
  modal,
  players,
  abilityData,
}) => {
  const activePlayer = user.index !== null ? players[user.index] : user.startingPlayer;

  const elapsedSeconds = (Date.now() + time.clockDifference - activePlayer.explodedAt) / 1000;
  let countDown = 0;
  if (!activePlayer.active && elapsedSeconds < 10) {
    countDown = round(10 - elapsedSeconds);
  }
  const {gold} = activePlayer;
  return (
    <div className={`playerData column ${!activePlayer.active ? 'waiting' : ''}`}>
      <div className="row">
        {activePlayer.updatedAt && handlePlayerIcon(activePlayer, countDown, modal.display)}
        <div className="playerLevel">{'level: ' + activePlayer.level}</div>
        <div className="nameInfo">{activePlayer.name}</div>
        {gold >= 0 && <PlayerStat image={goldIcon} alt={'gold'} value={gold} className="goldInfo"/>}
        {renderHitPoints(activePlayer)}
        {renderAbilityIcons(activePlayer, abilityData)}
        {renderWeapon(activePlayer.weaponIndex)}
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

const mapStateToProps = ({ modal, game, user, players, time, abilityData }) => {
  return { modal, game, user, players, time, abilityData };
}

const mapDispatchToProps = dispatch => {
  return { updateModalAction }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerData)


// export default PlayerData;
