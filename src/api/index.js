export const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:3001/cable' : 'wss://pacman-server.herokuapp.com/cable';
