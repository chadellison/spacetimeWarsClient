import React from 'react';
import '../styles/modal.css';
import {GameOverStat} from './GameOverStat';
import {GameButton} from './GameButton';

export class GameOverModal extends React.Component {
  componentDidMount() {
    this.props.gameSocket.unsubscribe()
  }

  render() {
    const {gameOverStats, resetGame} = this.props;
    return (
      <div className='modal'>
        <div className={`gameOverText ${gameOverStats.winningTeam}`}>{`${gameOverStats.winningTeam} Team Wins!`}</div>
        {gameOverStats.playerStats.sort((playerOne, playerTwo) => {
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
          onClick={resetGame}
          buttonText={'Exit'}
        />
      </div>
    );
  }
};
