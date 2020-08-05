import * as types from '../constants/actionTypes.js';

export const updateClockAction = (roundTripTime, timeDifference) => {
  return {
    type: types.UPDATE_CLOCK,
    roundTripTime,
    timeDifference,
  }
}

export const syncClocksAction = (iteration) => {
  return {
    type: types.SYNC_CLOCKS,
    iteration,
  }
}
