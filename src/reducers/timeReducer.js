import * as types from '../constants/actionTypes.js';
const DEFAULT_TIME_STATE = {
  clockDifference: 0,
  shortestRoundTripTime: 3000,
};

export const timeReducer = (state = DEFAULT_TIME_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CLOCK:
      if (ation.roundTripTime < state.shortestRoundTripTime) {
        const clockDifference = action.difference - (action.roundTripTime / 2)
        console.log('shorter time', roundTripTime)
        console.log('new clock difference', clockDifference)
        return {clockDifference, shortestRoundTripTime: action.roundTripTime}
      } else {
        return state;
      }
    default:
      return state
  }
}
