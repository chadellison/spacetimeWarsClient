import React from 'react';
import '../styles/modal.css';
import {GameButton} from './GameButton';
import {playSound} from '../helpers/audioHelpers.js';
import {mineDropSound} from '../constants/settings.js';

const updateName = (event, activePlayer, updateUserAction) => {
  // updateState({startingPlayer: {...activePlayer, name: event.target.value}})
  updateUserAction('startingPlayer', {...activePlayer, name: event.target.value})
}

const updateTeam = (activePlayer, team, updateUserAction) => {
  playSound(mineDropSound)
  // updateState({startingPlayer: {...activePlayer, team: team}})
  updateUserAction('startingPlayer', {...activePlayer, team})
}

export const NameFormModal = ({updateModalAction, updateUserAction, user, players}) => {
  const activePlayer = user.index !== null ? players[user.index] : user.startingPlayer;
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
        onChange={(e) => updateName(e, activePlayer, updateUserAction)}/>
      <label className="teamLabel">
        Select a team
      </label>
      <GameButton
        onClick={() => updateTeam(activePlayer, 'red', updateUserAction)}
        buttonText={'red'}
        className={`redTeamButton ${activePlayer.team === 'red' ? 'redBackground' : ''}`}
      />
      <GameButton
        onClick={() => updateTeam(activePlayer, 'blue', updateUserAction)}
        buttonText={'blue'}
        className={`blueTeamButton ${activePlayer.team === 'blue' ? 'blueBackground' : ''}`}
      />
      <GameButton
        onClick={() => updateModalAction({...modal, display: 'selection'})}
        buttonText={'submit'}
        className={'paginateButton'}
      />
    </div>
  );
};

const mapStateToProps = ({modal, user, players}) => {
  return { modal, user, players };
}

const mapDispatchToProps = dispatch => {
  return { updateModalAction, updateUserAction }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameFormModal)
