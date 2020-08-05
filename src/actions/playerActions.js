import * as types from '../constants/actionTypes.js';

export const fetchPlayersAction = () => {
  return {
    type: types.FETCH_PLAYERS,
  }
}

export const updatePlayersAction = (players) => {
  return {
    type: types.UPDATE_PLAYERS,
    players,
  }
}
