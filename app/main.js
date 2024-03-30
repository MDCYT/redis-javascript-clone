// Require dependencies
const net = require("net");

const CRLF = '\r\n'

// Handle connection
const server = net.createServer((socket) => {
  // Log when a client connects, and log the client address
  console.log("Client connected", socket.remoteAddress);

  // Handle ping
  socket.on("data", (data) => {
    if (data.toString().trim().toUpperCase().includes("PING")) {
      console.log("Received PING from client", socket.remoteAddress);
      socket.write("PONG" + CRLF);
    }
  });
});

server.listen(6379, "127.0.0.1");
