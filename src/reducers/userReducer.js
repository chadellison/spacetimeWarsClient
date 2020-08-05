import * as types from '../constants/actionTypes.js';
import { newPlayer } from '..helpers/playerHelpers.js';

const DEFAULT_USER_STATE = {
  userId: Date.now(),
  index: null,
  startingPlayer: {},
  lastFired: 0,
  up: false,
  left: false,
  right: false,
  space: false,
  upgrades: [0, 0, 0, 0],
};

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_USER:
      return {...state, [action.key]: action.value };
    case types.ADD_USER:
      return {...state, startingPlayer: newPlayer(action.userId, action.players)};
    default:
      return state
  }
}
