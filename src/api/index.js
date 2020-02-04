// api/index.js
const WEBSOCKET_HOST = process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : 'ws://pacman-server.herokuapp.com/'
console.log(WEBSOCKET_HOST)
let socket = new WebSocket(WEBSOCKET_HOST);

let connect = cb => {
  console.log("connecting");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = msg => {
    console.log(msg);
    cb(msg);
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  console.log("sending msg: ", msg);
  socket.send(msg);
};

export { connect, sendMsg };
