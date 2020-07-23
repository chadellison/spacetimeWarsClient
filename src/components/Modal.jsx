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
  players,
  activeTab,
  resetGame,
  gameSocket,
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
          updateState={updateState}
          handleGameEvent={handleGameEvent}
          activeTab={activeTab}
          page={page}
          index={index}
          players={players}
          activePlayer={activePlayer}
          clockDifference={clockDifference}
        />
      );
    case 'instructions':
      return <InformationModal updateState={updateState} />
    case 'credits':
      return <CreditsModal updateState={updateState} />
    case 'nameForm':
      return <NameFormModal updateState={updateState} activePlayer={activePlayer} />
    case 'gameOver':
      return (
        <GameOverModal
          gameOverStats={gameOverStats}
          resetGame={resetGame}
          gameSocket={gameSocket}
        />
      )
    default:
      return <div></div>
  }
};
