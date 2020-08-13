import React from 'react';
import '../styles/banner.css';
import {GameButton} from './GameButton';

export const Banner = ({content, updateState}) => {
  return (
    <h2 className="slowConnectionBanner">
      {content}
      <GameButton
        className={'bannerButton'}
        onClick={() => updateState({slowConnectionBanner: false})}
        buttonText={'OK'}
      />
    </h2>
  )
}
