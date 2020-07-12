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
  defenseData,
  updateState,
  activePlayer,
  gameOverStats,
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
        />
      );
    case 'instructions':
      return <InformationModal updateState={updateState} />
    case 'credits':
      return <CreditsModal updateState={updateState} />
    case 'nameForm':
      return <NameFormModal updateState={updateState} activePlayer={activePlayer} />
    case 'gameOver':
      return <GameOverModal gameOverStats={gameOverStats} updateState={updateState} defenseData={defenseData}/>
    default:
      return <div></div>
  }
};
