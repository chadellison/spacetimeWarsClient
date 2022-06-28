import React from 'react';
import '../styles/modal.css';
import {addPlayer} from '../helpers/playerHelpers.js';
import {GameButton} from './GameButton';

const renderHowToPlay = (howToPlay) => {
  if (howToPlay) {
    return (
      <div className="howToPlay">
        <div className="informationText">Click the "start" button</div>
        <div className="informationText">Enter a name for your ship</div>
        <div className="informationText">Select a team</div>
        <div className="informationText">Click "submit"</div>
        <div className="informationText">Select a Ship from the menu</div>
        <div className="informationText">Select a weapon</div>
        <div className="informationText">Click "start" to begin playing.</div>
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
        <div className="noteText">Note the other tabs, "Upgrades" and "Items". As you collect more gold you</div>
        <div className="noteText">may return to this menu at any time to purchase ships, weapons, upgrades and items.</div>
        <div className="noteText">Information about each is listed below the icon (price, description, etc.).</div>
        <div className="noteText">After selecting a ship and a weapon the "start" button will appear.</div>
      </div>
    )
  } else {
    return <div></div>
  }
}
export const InformationModal = ({updateState, howToPlay, userId, players}) => {
  return (
    <div className="modal">
      <h2 className="informationTitle">Space Wars</h2>
      <div className="introduction">
        Destroy your opponent's mothership while protecting your own.
      </div>

      <GameButton
        onClick={() => updateState({howToPlay: !howToPlay})}
        buttonText={howToPlay ? 'close' : 'how to play'}
        className={'howToPlayButton'}
      />
      <GameButton
        className={'startGameButton'}
        onClick={() => updateState(addPlayer(userId, players))}
        buttonText={'start'}
      />
      {renderHowToPlay(howToPlay)}

    </div>
  );
};
