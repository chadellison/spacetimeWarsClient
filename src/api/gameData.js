import Cable from 'actioncable';

import { API_HOST, getData, WEBSOCKET_HOST } from "./apiHelpers";

export const fetchGameData = (callback) => getData(`${API_HOST}/api/v1/players`, callback);
export const fetchScoreData = (callback) => getData(`${API_HOST}/api/v1/scores`, callback);

export const getClockData = (sentTime, callback) => {
  getData(`${API_HOST}/api/v1/time?sent_time=${sentTime}`, callback)
}

export const createGameSocket = (userId, received) => {
  let cable = Cable.createConsumer(WEBSOCKET_HOST)
  return cable.subscriptions.create({
    channel: 'GameDataChannel',
    userId
  },
  {
    connected: () => {},
    received,
    create: function(gameData) {
      this.perform('create', {
        gameData: gameData
      });
    }
  });
};
