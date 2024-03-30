// Require dependencies
const net = require("net");

const CRLF = '\r\n'

const sendMsg = (socket, msg) => {
  socket.write(msg + CRLF)
}

// Handle connection
const server = net.createServer((socket) => {
  // Log when a client connects, and log the client address
  console.log("Client connected", socket.remoteAddress);

  // Handle ping
  socket.on("data", (data) => {
    if (data.toString().trim().toUpperCase().includes("PING")) {
      console.log("Received PING from client", socket.remoteAddress);
      sendMsg(socket, "+PONG");
    }
  });
});

server.listen(6379, "127.0.0.1");
