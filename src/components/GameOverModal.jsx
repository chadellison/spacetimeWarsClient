import React from 'react';
import '../styles/modal.css';
import {GameOverStat} from './GameOverStat';
import {GameButton} from './GameButton';

export const GameOverModal = ({players, updateState}) => {
  return (
    <div className='modal'>
      <div className="gameOverText">Game Over</div>
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
