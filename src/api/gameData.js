import Cable from 'actioncable';
import { API_HOST, getData, postData, WEBSOCKET_HOST } from "./apiHelpers";
import { newPlayer } from '../helpers/playerHelpers';

export const fetchAllGames = (callback) => getData(`${API_HOST}/api/v1/games`, callback);
export const fetchGame = (gameId, callback) => getData(`${API_HOST}/api/v1/games/${gameId}`, callback);
export const createGame = (userId, callback) => postData(`${API_HOST}/api/v1/games`, { user_id: userId }, callback);
export const fetchScoreData = (callback) => getData(`${API_HOST}/api/v1/scores`, callback);
export const fetchPlayers = (gameId, callback) => getData(`${API_HOST}/api/v1/players?game_id=${gameId}`, callback);

export const getClockData = (sentTime, callback) => {
  getData(`${API_HOST}/api/v1/time?sent_time=${sentTime}`, callback)
}

export const createGameSocket = ({ userId, connected, disconnected, received, gameId }) => {
  let cable = Cable.createConsumer(WEBSOCKET_HOST);
  return cable.subscriptions.create({
    channel: 'GameDataChannel',
    player: newPlayer(userId),
    gameId,
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
