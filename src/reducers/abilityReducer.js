import * as types from '../constants/actionTypes.js';

const DEFAULT_ABILITY_DATA_STATE = {
  q: {lastUsed: 0, level: 0},
  w: {lastUsed: 0, level: 0},
  e: {lastUsed: 0, level: 0},
};

export const abilityReducer = (state = DEFAULT_ABILITY_DATA_STATE, action) => {
  switch (action.type) {
    // case types.UPDATE_PLAYERS:
    //   return {};
    default:
      return state
  }
}
