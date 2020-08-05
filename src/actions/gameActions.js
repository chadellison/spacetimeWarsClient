import * as types from '../constants/actionTypes.js';

export const updateGameAction = (payload) => {
  return {
    type: types.UPDATE_GAME,
    payload,
  }
}
