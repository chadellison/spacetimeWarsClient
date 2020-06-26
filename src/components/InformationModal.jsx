import React from 'react';
import '../styles/modal.css';
import redBomber from '../images/redBomber.png';
import blueBomber from '../images/blueBomber.png';

export const InformationModal = ({updateState}) => {
  return (
    <div className="modal">
      <div className="informationTitle">Space Wars</div>
      <div className="informationContext">
        There are two teams (Red and Blue).
      </div>
      <div className="informationContext">
        The object of the game is to prevent your opponents'
      </div>
      <div className="informationTitle">"Bombers"</div>
        <img src={redBomber} className="infoImage" alt="bomber" />
        <img src={blueBomber} className="infoImage blueShipInfo" alt="bomber" />
      <div className="informationContext">
        from weakening your defenses by crossing your team's edge of the screen.
      </div>
      <div className="informationContext">
        Each bomber that crosses the threshold reduces your team's defenses (starts at 100)
      </div>
      <div className="informationContext">
        The defense values will be located on the left during game play.
      </div>
      <div className="informationContext">
        The first team to bring the opponents defenses down to 0 wins!
      </div>
      <div className="informationTitle">How to play</div>
      <div className="informationText">Press any key to start or click the Start button</div>
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
      <div className="noteText">Note the other tabs, "Upgrades" and "Items". As you collect more gold you</div>
      <div className="noteText">may return to this menu at any time to purchase ships, weapons, upgrades and items.</div>
      <div className="noteText">Information about each is listed below the icon (price, description, etc.).</div>
      <div className="noteText">After selecting a ship and a weapon the "start" button will appear.</div>
      <div className="closeButton" onClick={() => updateState({modal: null})}>Close</div>
    </div>
  );
};
