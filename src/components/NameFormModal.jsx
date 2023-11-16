import { useEffect } from 'react';
import { fetchPlayers } from '../api/gameData.js';
import { mineDropSound } from '../constants/settings.js';
import { playSound } from '../helpers/audioHelpers.js';
import { CLIENT_HOST } from '../api/apiHelpers.js';
import '../styles/modal.css';
import { GameButton } from './GameButton';

const ROWS = [0, 1, 2, 3];
const updateName = (event, updateState, players, userId, handleGameEvent) => {
  let playerToUpdate = null;
  const updatedPlayers = players.map(player => {
    if (player.userId === userId) {
      playerToUpdate = { ...player, name: event.target.value }
      return playerToUpdate;
    } else {
      return player
    }
  });
  handleGameEvent({ ...playerToUpdate, gameEvent: 'waiting' });
  updateState({ players: updatedPlayers });
};

const handleDisplayName = (player) => {
  if (player.unsubscribed) {
    // never making it here...
    return 'Lost connection';
  } else {
    return player.name || 'Name...';
  }
};

const renderPlayerRow = (players, team, i) => {
  const player = players[i]
  
  if (player) {
    return <div key={`waitingRedPlayer${i}`} className={`playerListItem ${team}Border`}>{handleDisplayName(player)}</div>
  } else {
    return <div key={`waitingRedPlayer${i}`} className={`playerListItem ${team}Border availableSlot`}>{'available'}</div>
  }
};

const updateTeam = (updateState, players, team, userId, handleGameEvent) => {
  playSound(mineDropSound);
  let playerToUpdate = null;
  const updatedPlayers = players.map(player => {
    if (player.userId === userId) {
      playerToUpdate = { ...player, team }
      return playerToUpdate;
    } else {
      return player;
    }
  });
  handleGameEvent({ ...playerToUpdate, gameEvent: 'waiting' });
  updateState({ players: updatedPlayers });
};

const submitForm = (players, updateState, handleGameEvent, userId) => {
  const playerToUpdate = players.find(player => player.userId === userId)

  updateState({ modal: 'selection' })
  handleGameEvent({ ...playerToUpdate, gameEvent: 'waiting', initiateGame: true })
};

const handleStartGame = ({ hostId, userId, onClick }) => {
  if (hostId === userId) {
    return (
      <GameButton
        onClick={onClick}
        buttonText={'Start Game'}
        className={'startGameButton'}
      />
    )
  } else {
    return (
      <div>Waiting on host to start game</div>
    )
  }
};

const copyLinkToClipBoard = (gameId) => {
  const gameLink = `${CLIENT_HOST}?game=${gameId}`;
  navigator.clipboard.writeText(gameLink)
};

const renderTeamButton = (players, team, activePlayer, onChange) => {
  const disabled = players.length > 3

  return (
    <GameButton
      onClick={disabled ? () => {} : onChange}
      buttonText={team}
      className={`${team}TeamButton ${activePlayer.team === team ? `${team}Background` : ''} ${disabled && 'disabled'}`}
    />
  )
}

export const NameFormModal = ({ updateState, activePlayer, players, game, connected, userId, handleGameEvent }) => {
  useEffect(() => {
    if (game && connected) {
      const handlePlayerDataResponse = (playerData) => {
        updateState({ players: playerData.players });
      }
      fetchPlayers(game.id, handlePlayerDataResponse);
    }
  }, [game, connected]);

  const formValue = activePlayer.name ? activePlayer.name : '';

  const redPlayers = players.filter(player => player.team === 'red');
  const bluePlayers = players.filter(player => player.team === 'blue');

  return (
    <div className='modal'>
      <label className="formLabel">
        Name your vessel
      </label>
      <input type="text"
        maxLength={16}
        value={formValue}
        className="formInput"
        onChange={(e) => updateName(e, updateState, players, userId, handleGameEvent)} />
      <label className="teamLabel">
        Select a team
      </label>
      {renderTeamButton(redPlayers, 'red', activePlayer, () => updateTeam(updateState, players, 'red', userId, handleGameEvent))}
      {renderTeamButton(bluePlayers, 'blue', activePlayer, () => updateTeam(updateState, players, 'blue', userId, handleGameEvent))}
      <div className="playerList">
        <div className="redPlayersList">
          {ROWS.map(i => renderPlayerRow(redPlayers, 'red', i))}
        </div>
        <div className="bluePlayersList">
          {ROWS.map(i => renderPlayerRow(bluePlayers, 'blue', i))}
        </div>
      </div>
      <div className="waitingTextWrapper">
        <div className="inviteLink" onClick={() => copyLinkToClipBoard(game.id)}>Invite link</div>
      </div>
      {handleStartGame({ hostId: game?.hostId, userId, onClick: () => submitForm(players, updateState, handleGameEvent, userId) })}
    </div>
  );
};
