import React from "react";
import {SelectionModal} from './SelectionModal';
import {InformationModal} from './InformationModal';
import {CreditsModal} from './CreditsModal';
import {GameOverModal} from './GameOverModal';
import {NameFormModal} from './NameFormModal';

export const Modal = ({
  page,
  modal,
  index,
  userId,
  players,
  upgrades,
  activeTab,
  resetGame,
  howToPlay,
  defenseData,
  updateState,
  activePlayer,
  gameOverStats,
  clockDifference,
  handleGameEvent,
}) => {
  switch (modal) {
    case 'selection':
      return (
        <SelectionModal
          page={page}
          players={players}
          upgrades={upgrades}
          activeTab={activeTab}
          updateState={updateState}
          activePlayer={activePlayer}
          handleGameEvent={handleGameEvent}
          clockDifference={clockDifference}
        />
      );
    case 'instructions':
      return (
        <InformationModal
        updateState={updateState}
        howToPlay={howToPlay}
        userId={userId}
        players={players}
      />
      );
    case 'credits':
      return <CreditsModal updateState={updateState} index={index}/>
    case 'nameForm':
      return <NameFormModal updateState={updateState} activePlayer={activePlayer} />
    case 'gameOver':
      return (
        <GameOverModal
          gameOverStats={gameOverStats}
          resetGame={resetGame}
        />
      )
    default:
      return <div></div>
  }
};
