import React from 'react';
import '../styles/modal.css';
import {GameOverStat} from './GameOverStat';
import {GameButton} from './GameButton';

const gameOverText = (defenseData) => {
  if (defenseData.red <= 0) {
    return <div className="gameOverText blue">Blue Team Wins!</div>
  } else {
    return <div className="gameOverText red">Red Team Wins!</div>
  }
}

export const GameOverModal = ({players, updateState, defenseData}) => {
  return (
    <div className='modal'>
      {gameOverText(defenseData)}
      {players.sort((playerOne, playerTwo) => {
        if (playerOne.score > playerTwo.score) {
          return -1
        }
        if (playerOne.score < playerTwo.score) {
          return 1
        }
        return 0;
      }).filter((player) => player.type === 'human').map((player, index) => {
        return (
          <GameOverStat player={player} key={`gameOver${index}`} index={index}/>
        );
      })}
      <GameButton
        className={'exitButton'}
        onClick={() => updateState({modal: null})}
        buttonText={'Exit'}
      />
    </div>
  );
};
