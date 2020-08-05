import * as types from '../constants/actionTypes.js';
import { updateClockAction, syncClocksAction } '../actions/updateClockAction.js';
import { fetchPlayersAction } '../actions/fetchPlayersAction.js';
import { getData } from '..helpers/httpHelpers.js';

export function* watchSyncClocks() {
  yield takeEvery(types.SYNC_CLOCKS, syncClocks)
}

export function* syncClocks(action) {
  const sentTime = Date.now();
  const timeResponse = yield call(getData, `/api/v1/time?sent_time=${sentTime}`);
  const responseTime = Date.now();
  const roundTripTime = responseTime - sentTime;
  yield put(updateClockAction(roundTripTime, timeResponse.difference));
  if (action.iteration > 0) {
    yield put(syncClocksAction(action.iteration - 1));
  } else {
    yield put(fetchPlayersAction());
  };
};
