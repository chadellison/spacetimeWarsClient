import React from "react";
import {WEAPONS} from '../constants/settings.js';
import '../styles/playerData.css';

const PlayerData = ({currentPlayer}) => {
  return (
    <div className="playerData column">
      <div className="row">
        <img className="playerImage" src={`https://robohash.org/${currentPlayer.name}`} alt="player"/>
        <div className="playerInfo">{currentPlayer.name}</div>
        <div className="playerInfo">{`Lives: ${currentPlayer.lives}`}</div>
        <div className="playerInfo">{`Ship: thunder ship`}</div>
        <div className="playerInfo">{`Weapon: ${WEAPONS[currentPlayer.weapon].name}`}</div>
        <div className="playerInfo">{`Hitpoints: ${currentPlayer.hitpoints}`}</div>
        <div className="playerInfo">{`Gold: 1000`}</div>
        <div className="playerInfo">{`Score: 0`}</div>
      </div>
    </div>
  );
}

export default PlayerData;
