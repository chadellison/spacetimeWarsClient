import React from 'react';
import '../styles/modal.css';
import {GameButton} from './GameButton';
import {playSound} from '../helpers/audioHelpers.js';
import {mineDropSound} from '../constants/settings.js';

const updateName = (event, updateState, currentPlayer) => {
  updateState({currentPlayer: {...currentPlayer, name: event.target.value}})
}

const updateTeam = (updateState, currentPlayer, team) => {
  playSound(mineDropSound)
  updateState({currentPlayer: {...currentPlayer, team}})
}

export const NameFormModal = ({updateState, currentPlayer}) => {
  const formValue = currentPlayer.name ? currentPlayer.name : ''
  return (
    <div className='modal'>
      <label className="formLabel">
        Create a username
      </label>
      <input type="text"
        maxLength={16}
        value={formValue}
        className="formInput"
        onChange={(e) => updateName(e, updateState, currentPlayer)}/>
      <label className="teamLabel">
        Select a team
      </label>
      <div className={`redTeamButton ${currentPlayer.team === 'red' ? 'redBackground' : ''}`}
        onClick={() => updateTeam(updateState, currentPlayer, 'red')}>
          red
      </div>
      <div className={`blueTeamButton ${currentPlayer.team === 'blue' ? 'blueBackground' : ''}`}
        onClick={() => updateTeam(updateState, currentPlayer, 'blue')}>
          blue
      </div>
      <GameButton
        onClick={() => updateState({modal: 'selection'})}
        buttonText={'Submit'}
        className={'paginateButton'} />
    </div>
  );
};
