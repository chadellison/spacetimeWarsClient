import React from 'react';
import '../styles/headerButtons.css';
import {GameButton} from './GameButton';

export const HeaderButtons = ({modal, updateModalAction}) => {
  return (
    <div className="headerButtons">
      <GameButton
        buttonText={'credits'}
        onClick={() => updateModalAction({...modal, display: 'credits'})}
        className="headerButton"
      />
    </div>
  );
};

const mapStateToProps = ({ modal }) => {
  return { modal };
}

const mapDispatchToProps = dispatch => {
  return { updateModalAction }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderButtons)
