import * as types from '../constants/actionTypes.js';

export const updateUserAction = (key, value) => {
  return {
    type: types.UPDATE_USER,
    key,
    value,
  }
}

export const addUserAction = (userId, players) => {
  return {
    type: types.ADD_USER,
    userId,
    players,
  }
}
