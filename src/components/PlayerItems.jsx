import React from "react";
import '../styles/playerData.css';
import {ITEMS} from '../constants/items.js';

export const PlayerItems = ({items}) => {
  return Object.values(items).map((item) => {
    let countDown = 0;
    if (item.durationCount < item.cooldown) {
      countDown = Math.round((item.cooldown - item.durationCount) / 1000);
    }
    return (
      <div className="playerItemData" key={'playerItem' + item.index}>
        <div className="itemCountDown" hidden={countDown === 0 || countDown > 9}>
          {countDown}
        </div>
        <img
          className={`playerItemImage${countDown ? ' faded' : ''}`}
          src={ITEMS[item.index].image}
          alt="playerItem"
        />
      </div>
    )
  });
}
