import React from 'react';
import '../styles/ship.css';
import {gong, notEnoughResources} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';
import {ABILITIES} from '../constants/abilities.js';
import {AbilityDisplay} from './AbilityDisplay';

export class Ship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: false,
      w: false,
      e: false,
    }
  }

  handleClick = (shipIndex) => {
    const {activePlayer, updateState, index, players} = this.props;
    const gold = activePlayer.gold - SHIPS[shipIndex].price;

    if (gold >= 0) {
      gong.play();
      const player = {
        ...activePlayer,
        shipIndex: shipIndex,
        gold: gold,
        armor: SHIPS[shipIndex].armor,
        hitpoints: SHIPS[shipIndex].hitpoints,
        maxHitpoints: SHIPS[shipIndex].hitpoints,
        velocity: SHIPS[shipIndex].speed,
      }
      if (index !== null) {
        let updatedPlayers = [...players];
        updatedPlayers[index] = player
        updateState({players: updatedPlayers})
      } else {
        updateState({startingPlayer: player, activeTab: 'Weapons', page: 1});
      }
    } else {
      notEnoughResources.play();
      console.log('Not enough gold');
    }
  };

  renderDescriptions = () => {
    let content;
    if (this.state.q) {
      content = ABILITIES[this.props.ship.abilities.q].description;
    } else if (this.state.w) {
      content = ABILITIES[this.props.ship.abilities.w].description;
    } else if (this.state.e) {
      content = ABILITIES[this.props.ship.abilities.e].description;
    };

    return <div className="abilityDescription">{content}</div>
  }

  render() {
    const {imageSrc, activePlayer, ship} = this.props;
    return (
      <div className={`selection ${activePlayer.shipIndex === ship.index ? 'selected' : ''}`}
        onClick={() => this.handleClick(ship.index)}>
          <div className="imageWrapper">
            <img id={ship.index} src={imageSrc} alt="ship" className="selectionImage"/>
          </div>
          <div className="selectionTitle">
            {`${ship.name}`}
          </div>
          <div className="selectionPrice">
            {`Price: ${ship.price}`}
          </div>
          <div className="selectionData">
            {`Hitpoints: ${ship.hitpoints}`}
          </div>
          <div className="selectionData">
            {`Armor: ${ship.armor}`}
          </div>
          <div className="selectionData">
            {`Speed: ${ship.speed}`}
          </div>
          <div className="abilityTitle">
            Abilities
          </div>
            {[
              {abilityImage: ABILITIES[ship.abilities.q].image, key: 'Q', value: 'q'},
              {abilityImage: ABILITIES[ship.abilities.w].image, key: 'W', value: 'w'},
              {abilityImage: ABILITIES[ship.abilities.e].image, key: 'E', value: 'e'}
             ].map((abilityData, index) => {
                return (
                  <AbilityDisplay key={'displayAbility' + index}
                    abilityData={abilityData}
                    onMouseEnter={() => this.setState({[abilityData.value]: true})}
                    onMouseLeave={() => this.setState({[abilityData.value]: false})}
                  />
                )
            })}
          <div className="selectionDescription">
            {this.renderDescriptions()}
          </div>
      </div>
    );
  }
};
