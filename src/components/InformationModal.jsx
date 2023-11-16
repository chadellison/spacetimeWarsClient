import { useEffect, useState } from 'react';
import { createGame, fetchAllGames, fetchGame } from '../api/gameData';
import '../styles/modal.css';
import { GameButton } from './GameButton';

const renderHowToPlay = () => {
  return (
    <div className="howToPlay">
      <div className="informationTitle">Controls</div>
      <div className="informationText">
        <span className="instructionControl">"Up":</span> accelerate
      </div>
      <div className="informationText">
        <span className="instructionControl">"Left":</span> rotate left
      </div>
      <div className="informationText">
        <span className="instructionControl">"Right":</span> rotate right
      </div>
      <div className="informationText">
        <span className="instructionControl">"Space":</span> fire weapon
      </div>
      <div className="informationText">
        <span className="instructionControl">"Q", "W", "E":</span> use ship ability respectively
      </div>
      <div className="informationTitle">
        Shop menu
      </div>
      <div className="informationText">
        The shop menu can be used to purchase ships, weapons, and items.
      </div>
      <div className="noteText">This menu can be accessed at any time to make purchases / apply upgrades</div>
      <div className="noteText">Information about each is listed below the icon (price, description, etc.).</div>
      <div className="noteText">
        Underneath the shop button, you will see your gold, selected ship, selected weapon, score, and items
      </div>
      <div className="informationTitle">
        Ships
      </div>
      <div className="informationText">
        {"Each ship has three abilities. You can see a description of each ship's ability by hovering over it in the ship menu."}
      </div>
      <div className="informationText">
        {"Each ship's respective ability can be selected and used with \"q\", \"w\", and \"e\""}
      </div>
      <div className="informationTitle">
        Weapons
      </div>
      <div className="informationText">
        By hovering over each weapon you can see a description of what that item does
      </div>
      <div className="informationTitle">
        Upgrades
      </div>
      <div className="informationText">
        As you destroy enemy ships, you will receive experience which will allow you to level up.
      </div>
      <div className="informationText">
        Upon leveling up, you can select an attribute to upgrade on your ship (armor, hit points, speed, or attack damage).
      </div>
      <div className="informationTitle">
        Items
      </div>
      <div className="informationText">
        You can see a description of what each item will do by hovering over it.
      </div>
    </div>
  )
}

const renderText = (showInstructions) => {
  if (showInstructions) {
    return renderHowToPlay();
  } else {
    return (
      <div className="informationTitle">
        Harness the power of weapons, collect valuable items, and unlock upgrades as you engage in an epic battle to obliterate your rival's mothership while defending yours.
      </div>
    );
  }
}
export const InformationModal = ({ updateState, showInstructions, userId, handleSocket }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchAllGames(gameData => {
      const availableGames = gameData.games.filter(game => game.available);
      setGames(availableGames);
    })
  }, [])

  const handleClick = (gameId) => {
    if (gameId) {
      fetchGame(gameId, handleSocket);
    } else {
      createGame(userId, handleSocket);
    }
    updateState({ modal: 'nameForm' });
  };

  return (
    <div className="modal">
      <h2 className="informationTitle">Space Wars</h2>
      <div className="introduction">
        Destroy your opponent's mothership while protecting your own.
      </div>
      {
        games.length > 0 && <div>
          <GameButton
            className="modeGameButton"
            onClick={() => handleClick(games[0].id)}
            buttonText={'Join Game'}
          />
        </div>
      }
      {
        <div>
          <GameButton
            className="modeGameButton"
            onClick={() => handleClick()}
            buttonText={games.length > 0 ? 'Create Game' : 'Play'}
          />
        </div>
      }
      <div>
        <GameButton
          onClick={() => updateState({ showInstructions: !showInstructions })}
          buttonText={showInstructions ? 'close' : 'How to play'}
          className={'howToPlayButton'}
        />
      </div>
      {renderText(showInstructions)}
    </div>
  )
}
