import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { playerReducer } from './playerReducer';
import { gameReducer } from './gameReducer';
import { timeReducer } from './timeReducer';

export default combineReducers({
  user: userReducer,
  game: gameReducer,
  gameEvent: gameEventReducer,
  players: playerReducer,
  deployedWeapons: weaponReducer,
  abilityData: abilityReducer,
  modal: modalReducer,
  time: timeReducer,
});
