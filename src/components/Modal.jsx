import React from "react";
import { CreditsModal } from './CreditsModal';
import { GameOverModal } from './GameOverModal';
import { InformationModal } from './InformationModal';
import { LeaderboardModal } from './LeaderboardModal';
import { NameFormModal } from './NameFormModal';
import { NotificationModal } from "./NotificationModal";
import { SelectionModal } from './SelectionModal';

export const Modal = ({
  page,
  modal,
  scores,
  players,
  upgrades,
  activeTab,
  updateState,
  activePlayer,
  gameOverStats,
  clockDifference,
  handleGameEvent,
  showInstructions,
  initializeGame
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
          showInstructions={showInstructions}
          initializeGame={initializeGame}
      />
      );
    case 'credits':
      return <CreditsModal updateState={updateState} />
    case 'nameForm':
      return <NameFormModal updateState={updateState} activePlayer={activePlayer} />
    case 'gameOver':
      return <GameOverModal gameOverStats={gameOverStats} />
    case 'leaderboard':
      return <LeaderboardModal scores={scores} updateState={updateState} />
    case 'deviceChageNotification':
      return <NotificationModal title="Device Issue" content="This game is desinged to be played on a device with a larger screen. Please try again with a different device" />;
    default:
      return <div></div>
  }
};
