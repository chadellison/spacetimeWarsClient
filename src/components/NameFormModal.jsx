import faker from 'faker';
import React from 'react';
import { mineDropSound } from '../constants/settings.js';
import { playSound } from '../helpers/audioHelpers.js';
import '../styles/modal.css';
import { GameButton } from './GameButton';

const updateName = (event, updateState, activePlayer) => {
  updateState({ startingPlayer: { ...activePlayer, name: event.target.value } })
}

const updateTeam = (updateState, activePlayer, team) => {
  playSound(mineDropSound)
  updateState({ startingPlayer: { ...activePlayer, team: team } })
}

const submitForm = (activePlayer, updateState) => {
  if (activePlayer.name) {
    updateState({ modal: 'selection' })
  } else {
    updateState({
      startingPlayer: { ...activePlayer, name: faker.name.findName() },
      modal: 'selection'
    })
  }
}

export const NameFormModal = ({ updateState, activePlayer }) => {
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
        onChange={(e) => updateName(e, updateState, activePlayer)} />
      <label className="teamLabel">
        Select a team
      </label>
      <GameButton
        onClick={() => updateTeam(updateState, activePlayer, 'red')}
        buttonText={'red'}
        className={`redTeamButton ${activePlayer.team === 'red' ? 'redBackground' : ''}`}
      />
      <GameButton
        onClick={() => updateTeam(updateState, activePlayer, 'blue')}
        buttonText={'blue'}
        className={`blueTeamButton ${activePlayer.team === 'blue' ? 'blueBackground' : ''}`}
      />
      <GameButton
        onClick={() => submitForm(activePlayer, updateState)}
        buttonText={'submit'}
        className={'paginateButton'}
      />
    </div>
  );
};
