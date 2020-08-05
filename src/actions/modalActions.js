import * as types from '../constants/actionTypes.js';

export const updateModalAction = (key, value) => {
  return {
    type: types.UPDATE_MODAL,
    key,
    value,
  }
}
