export const API_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://spacetime-wars-server.herokuapp.com';
export const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:3001/cable' : 'wss://spacetime-wars-server.herokuapp.com/cable';
