export const API_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://tank-game-server.herokuapp.com';
export const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:3001/cable' : 'wss://tank-game-server.herokuapp.com/cable';
