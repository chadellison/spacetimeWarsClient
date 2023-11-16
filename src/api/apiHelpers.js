import axios from 'axios';

export const CLIENT_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.spacetime-wars.com';
export const API_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://spacetime-wars-server.herokuapp.com';
export const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:3001/cable' : 'wss://spacetime-wars-server.herokuapp.com/cable';

export const getData = async (url, callback) => {
  try {
    const response = await axios.get(url);
    callback(response.data)
  } catch (error) {
    console.error(error);
  }
};

export const postData = async (url, body, callback) => {
  try {
    const response = await axios.post(url, body);
    callback(response.data)
  } catch (error) {
    console.error(error);
  }
};
