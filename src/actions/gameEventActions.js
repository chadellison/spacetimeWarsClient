import * as types from '../constants/actionTypes.js';

export const updateGameEventAction = (payload) => {
  return {
    type: types.UPDATE_GAME_EVENT,
    payload,
  }
}
