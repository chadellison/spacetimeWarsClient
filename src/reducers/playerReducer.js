import * as types from '../constants/actionTypes.js';

export const playerReducer = (state = [], action) => {
  switch (action.type) {
    case types.UPDATE_PLAYERS:
      return action.players;
    default:
      return state
  }
}
