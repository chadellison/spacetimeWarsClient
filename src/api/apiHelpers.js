import axios from 'axios';

export const API_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://spacetime-wars-server.herokuapp.com';
export const API_RESOURCE_URL = 'https://spacetime-wars-resources-89f7353aef5e.herokuapp.com/api/v1/image_resources';
// export const API_RESOURCE_URL = 'http://localhost:3002/api/v1/image_resources';
export const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:3001/cable' : 'wss://spacetime-wars-server.herokuapp.com/cable';

export const getData = async (url, callback) => {
  try {
    const response = await axios.get(url);
    callback(response.data)
  } catch (error) {
    console.error(error);
  }
}
