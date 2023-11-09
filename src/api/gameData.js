import Cable from 'actioncable';

import { API_HOST, getData, WEBSOCKET_HOST } from "./apiHelpers";

export const fetchGameData = (callback) => getData(`${API_HOST}/api/v1/players`, callback);
export const fetchScoreData = (callback) => getData(`${API_HOST}/api/v1/scores`, callback);

export const getClockData = (sentTime, callback) => {
  getData(`${API_HOST}/api/v1/time?sent_time=${sentTime}`, callback)
}

export const createGameSocket = ({ userId, connected, disconnected, received }) => {
  let cable = Cable.createConsumer(WEBSOCKET_HOST);

  return cable.subscriptions.create({
    channel: 'GameDataChannel',
    userId
  },
  {
    connected,
    disconnected: () => {
      console.log('Connection lost -- attempting reconnect');
      disconnected()
      setTimeout(() => {
        cable.connect()
      }, 1000);
    },
    received,
    create: function(gameData) {
      this.perform('create', {
        gameData: gameData
      });
    }
  });
};
