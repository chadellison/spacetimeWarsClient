import React from 'react';
import '../styles/modal.css';
import { GameOverStat } from './GameOverStat';
import { GameButton } from './GameButton';
import { DEFAULT_STATE } from './Layout';

export const GameOverModal = ({ winningTeam, players, updateState, gameSocket }) => {
  const handleGameOver = () => {
    gameSocket.unsubscribe();
    updateState(DEFAULT_STATE);
  };

  return (
    <div className='modal'>
      <div className={`gameOverText ${winningTeam}`}>{`${winningTeam} Team Wins!`}</div>
      {players.sort((playerOne, playerTwo) => {
        if (playerOne.score > playerTwo.score) {
          return -1
        }
        if (playerOne.score < playerTwo.score) {
          return 1
        }
        return 0;
      }).map((player, index) => <GameOverStat player={player} key={`gameOver${index}`} index={index} />)}
      <GameButton
        className={'exitButton'}
        onClick={handleGameOver}
        buttonText={'Exit'}
      />
    </div>
  );
};
