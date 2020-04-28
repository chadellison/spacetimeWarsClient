import React from 'react';
import '../styles/modal.css';
import {GameButton} from './GameButton';

const onChange = (event, updateState, currentPlayer) => {
  updateState({currentPlayer: {...currentPlayer, name: event.target.value}})
}

export const NameFormModal = ({updateState, currentPlayer}) => {
  const formValue = currentPlayer.name ? currentPlayer.name : ''
  return (
    <div className='modal'>
      <label className="formLabel">
        Create a username
      </label>
      <input type="text" maxlength={16} value={formValue} className="formInput" onChange={(e) => onChange(e, updateState, currentPlayer)}/>
      <GameButton
        onClick={() => updateState({modal: 'selection'})}
        buttonText={'Submit'}
        className={'paginateButton'} />
    </div>
  );
};
