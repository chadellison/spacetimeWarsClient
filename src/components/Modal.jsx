import React from "react";
import {SelectionModal} from './SelectionModal';
import {InformationModal} from './InformationModal';
import {CreditsModal} from './CreditsModal';
import {GameOverModal} from './GameOverModal';
import {NameFormModal} from './NameFormModal';

export const Modal = ({
  page,
  modal,
  userId,
  players,
  activeTab,
  gameOverStats,
  currentPlayer,
  defenseData,
  updateState,
  handleGameEvent
}) => {
  switch (modal) {
    case 'selection':
      return (
        <SelectionModal
          updateState={updateState}
          handleGameEvent={handleGameEvent}
          userId={userId}
          activeTab={activeTab}
          page={page}
          currentPlayer={currentPlayer}
          players={players}
        />
      );
    case 'instructions':
      return <InformationModal updateState={updateState} />
    case 'credits':
      return <CreditsModal updateState={updateState} />
    case 'nameForm':
      return <NameFormModal updateState={updateState} currentPlayer={currentPlayer} />
    case 'gameOver':
      return <GameOverModal gameOverStats={gameOverStats} updateState={updateState} defenseData={defenseData}/>
    default:
      return <div></div>
  }
};
