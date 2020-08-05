import * as types from '../constants/actionTypes.js';
import { getClockDifference, getGameData, getUserId } from '.selectors.js';
import { getData } from '..helpers/httpHelpers.js';
import { updatePlayer } from '../helpers/gameLogic.js';
import { updatePlayersAction } from '../actions/playerActions.js';
import { updateGameAction } from '../actions/gameActions.js';
import { createGameSocket } from '.gameSocket.js';

export function* watchFetchPlayers() {
  yield takeEvery(types.FETCH_PLAYERS, fetchPlayers)
}

export function* fetchPlayers() {
  const clockDifference = yield select(getClockDifference);
  // const playerResponse = yield call(getData, `/api/v1/time?sent_time=${sentTime}`);
  const gameResponse = yield call(getData, '/api/v1/players');
    // .then((response) => response.json())
    // .then((gameData) => {
    const players = gameResponse.players.map((player) => {
      const elapsedTime = Date.now() + clockDifference - player.updatedAt
      if (player.active) {
        return updatePlayer(player, elapsedTime, clockDifference)
      } else {
        return player;
      }
    });
    yield put(updatePlayersAction(players));

    const aiShips = gameResponse.aiShips.map((ship) => {
      const elapsedTime = Date.now() + clockDifference - ship.updatedAt
      return updatePlayer(ship, elapsedTime, clockDifference);
    });
    const gameData = yield select(getGameData);
    yield put(updateGameAction({...gameData, aiShips, defenseData: gameResponse.defenseData}));
    const userId = yield select(getUserId);
    createGameSocket(userId);
};
