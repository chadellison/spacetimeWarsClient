import React from 'react';
import '../styles/modal.css';
import {GameButton} from './GameButton';
import {playSound} from '../helpers/audioHelpers.js';
import {mineDropSound} from '../constants/settings.js';

const updateName = (event, updateState, activePlayer) => {
  updateState({startingPlayer: {...activePlayer, name: event.target.value}})
}

const updateTeam = (updateState, activePlayer, team) => {
  playSound(mineDropSound)
  updateState({startingPlayer: {...activePlayer, team: team}})
}

export const NameFormModal = ({updateState, activePlayer}) => {
  const formValue = activePlayer.name ? activePlayer.name : ''
  return (
    <div className='modal'>
      <label className="formLabel">
        Create a username
      </label>
      <input type="text"
        maxLength={16}
        value={formValue}
        className="formInput"
        onChange={(e) => updateName(e, updateState, activePlayer)}/>
      <label className="teamLabel">
        Select a team
      </label>
      <div className={`redTeamButton ${activePlayer.team === 'red' ? 'redBackground' : ''}`}
        onClick={() => updateTeam(updateState, activePlayer, 'red')}>
          red
      </div>
      <div className={`blueTeamButton ${activePlayer.team === 'blue' ? 'blueBackground' : ''}`}
        onClick={() => updateTeam(updateState, activePlayer, 'blue')}>
          blue
      </div>
      <GameButton
        onClick={() => updateState({modal: 'selection'})}
        buttonText={'Submit'}
        className={'paginateButton'} />
    </div>
  );
};
