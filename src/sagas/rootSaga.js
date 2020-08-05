import { all, fork } from 'redux-saga/effects';
import { watchSyncClocks } from './timeSagas';
import { watchFetchPlayers } from './playerSagas';

export default function* rootSaga() {
  yield all([
    fork(watchSyncClocks),
    fork(watchFetchPlayers),
    // fork(watchSignUp),
    // fork(watchCreateGame),
    // fork(watchMachineVsMachineGame),
    // fork(watchJoinGame),
    // fork(watchFetchAnalyticsData)
  ])
}
