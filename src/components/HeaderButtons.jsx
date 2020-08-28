import React from 'react';
import '../styles/headerButtons.css';
import {GameButton} from './GameButton';
import {Icon} from './Icon';
import facebookIcon from '../images/facebookIcon.png';

export const HeaderButtons = ({updateState}) => {
  return (
    <div className="headerButtons">
      <GameButton
        buttonText={'credits'}
        onClick={() => updateState({modal: 'credits'})}
        className="headerButton"
      />
      <Icon src={facebookIcon} alt={'facebook icon'} onClick={() => window.open('https://www.facebook.com/Space-Wars-102355468242395','_blank')}/>
    </div>
  );
};
