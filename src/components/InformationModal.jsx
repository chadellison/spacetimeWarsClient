import React from 'react';
import '../styles/modal.css';
import {addPlayer} from '../helpers/playerHelpers.js';
import {GameButton} from './GameButton';

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
        The shop menu can be used to purchase ships, purchase a weapons, select upgrades, and purchase items.
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
        Each ship has three abilities. You can see a description of each ship’s ability by hovering over it in the ship menu.
      </div>
      <div className="informationText">
        Each ship’s respective ability can be selected and used with “q”, “w”, and “e”.
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
export const InformationModal = ({updateState, userId, players, showInstructions}) => {
  return (
    <div className="modal">
      <h2 className="informationTitle">Space Wars</h2>
      <div className="introduction">
        Destroy your opponent's mothership while protecting your own.
      </div>
      <GameButton
        onClick={() => updateState({showInstructions: !showInstructions})}
        buttonText={showInstructions ? 'close' : 'Instructions'}
        className={'howToPlayButton'}
      />
      <GameButton
        className={'startGameButton'}
        onClick={() => updateState(addPlayer(userId, players))}
        buttonText={'start'}
      />
      <div className="informationTitle">
        The Object of the game:
      </div>
      <div className="informationText">
        Use weapons, items, and upgrades to destroy your opponents’ mothership before yours gets destroyed
      </div>
      <div className="informationText">
        The Red mothership is located at the top left and the blue mothership is located at the bottom right of the screen
      </div>
      {showInstructions && renderHowToPlay()}
    </div>
  );
};
