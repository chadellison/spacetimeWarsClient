import * as types from '../constants/actionTypes.js';

const DEFAULT_MODAL_STATE = {
  display: 'instructions',
  activeTab: 'Ships',
  page: 1,
  howToPlay: false,
};

export const modalReducer = (state = DEFAULT_MODAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_MODAL:
      return action.payload;
    default:
      return state
  }
}
