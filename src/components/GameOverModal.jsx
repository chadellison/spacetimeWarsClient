import React from 'react';
import '../styles/modal.css';
import {GameOverStat} from './GameOverStat';
import {GameButton} from './GameButton';

const resetGame = () => {
  // const newState = {
  //   ...DEFAULT_STATE,
  //   userId: this.state.userId,
  //   clockDifference: this.state.clockDifference,
  //   shortestRoundTripTime: this.state.shortestRoundTripTime
  // }
  // this.updateState(newState);
  // this.syncClocks(3)
  console.log('do lots of things fire all the actions etc')
}

export const GameOverModal = ({game}) => {
  return (
    <div className='modal'>
      <div className={`gameOverText ${game.gameOverStats.winningTeam}`}>{`${game.gameOverStats.winningTeam} Team Wins!`}</div>
      {game.gameOverStats.playerStats.sort((playerOne, playerTwo) => {
        if (playerOne.score > playerTwo.score) {
          return -1
        }
        if (playerOne.score < playerTwo.score) {
          return 1
        }
        return 0;
      }).map((player, index) => {
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
};

const mapStateToProps = ({game}) => {
  return { game };
}

const mapDispatchToProps = dispatch => {
  return { updateModalAction }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOverModal)
