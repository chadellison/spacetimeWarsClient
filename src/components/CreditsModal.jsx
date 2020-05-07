import React from 'react';
import '../styles/modal.css';

export const CreditsModal = ({updateState}) => {
  return (
    <div className='modal'>
      <div className="closeButton" onClick={() => updateState({modal: null})}>Close</div>
      <div className="informationTitle">Credits</div>
      <div className="informationText">
        <span className="instructionControl">Background art:</span>Vadim Sadovski/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Spaceship art:</span> MillionthVector
        <a className="assetLink"
          href="http://millionthvector.blogspot.com/p/free-sprites.html"
          target="_blank"
          rel="noopener noreferrer">
            millionth vector
        </a>
      </div>
      <div className="informationText">
        <span className="creditTitle">fireball:</span>Alexander Mak/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">missile:</span>Edilus/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">bomb:</span>MillionthVector
      </div>
      <div className="informationText">
        <span className="creditTitle">laser:</span>MillionthVector
      </div>
      <div className="informationText">
        <span className="creditTitle">trifecta:</span>MillionthVector
      </div>
      <div className="informationText">
        <span className="creditTitle">poison cannon:</span>Samokhina Anna/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">blue fire:</span>Zimniy/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">plasma cannon:</span>MillionthVector
      </div>
      <div className="informationText">
        <span className="creditTitle">Armor Upgrade:</span>anttoniart/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Hitpoints Upgrade:</span>Titima Ongkantong/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Speed Upgrade:</span>Panuwatccn/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Damage Upgrade:</span>anttoniart/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Health Boost Item:</span>dTosh/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Repair bots Item:</span>CoreDESIGN/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Stealth mode Item:</span>LuckyStep/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Absorb Damage Item:</span>benchart/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Armor Boost Item:</span>kursi design/Shutterstock.com
      </div>
      <div className="informationText">
        <span className="creditTitle">Gold Icon:</span>AlexRoz/Shutterstock.com
      </div>
      <div className="closeButton" onClick={() => updateState({modal: null})}>Close</div>
    </div>
  );
};
