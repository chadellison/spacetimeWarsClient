import * as types from '../constants/actionTypes.js';

const DEFAULT_GAME_EVENT_STATE = {
  lastSend: 0,
  count: 0,
  shipCount: 0,
  shipHitpoints: 100,
  userEvents: {},
  sendInterval: 30
};

export const gameEventReducer = (state = DEFAULT_GAME_EVENT_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_GAME_EVENT:
      return action.payload;
    default:
      return state
  }
}
