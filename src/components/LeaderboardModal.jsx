import React from "react";
import '../styles/modal.css';
import {Score} from './Score';

export const LeaderboardModal = ({updateState, scores}) => {
  return (
    <div className='modal'>
      <div className="closeButton" onClick={() => updateState({modal: ''})}>Close</div>
      <div className="leaderboardTitle">Leader Board</div>
      {scores.map((score, index) => {
        return <Score score={score} key={'leaderboard' + index}/>
      })}
      <div className="closeButton" onClick={() => updateState({modal: ''})}>Close</div>
    </div>
  );
};
