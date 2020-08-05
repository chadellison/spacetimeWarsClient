import * as types from '../constants/actionTypes.js';

const DEFAULT_GAME_STATE = {
  gameBuff: {},
  gameOverStats: {},
  aiShips: [],
  defenseData: { red: 10, blue: 10 },
  animations: [],
};

export const gameReducer = (state = DEFAULT_GAME_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_GAME:
      return {...state, action.payload };
    default:
      return state
  }
}
