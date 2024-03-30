// Require dependencies
const net = require("net");
const commandsInterface = require("./interfaces/commands");

const CRLF = '\r\n'

const values = new Map();

// Handle connection
const server = net.createServer((socket) => {
  // Log when a client connects, and log the client address
  console.log("Client connected", socket.remoteAddress);

  // Handle ping
  socket.on("data", (data) => {

    // example data
    /*
    *1 => command length
    $4 => type of data, in this case a string
    ping => command

    *2 => command length
    $4 => type of data, in this case a string
    echo => command
    $3 => Type of data, in this case a number
    123 => data
    $1 => Type of data, in this case a "boolean" (0 or 1)
    0 => data
    $2 => Type of data, in this case a parameter "-a" or more
    -a => data
  */

    // I need a regex to get the command, example, ping or echo
    const commandRegex = /\$[0-9]+\r\n([a-zA-Z]+)\r\n/g
    const parametersRegex = /\$[0-9]+\r\n([a-zA-Z0-9.-]+)\r\n/g

    const command = data.toString().match(commandRegex)[0].split('\n')[1].replace('\r', '');

    let parameters = [];

    data.toString().match(parametersRegex)?.forEach((parameter) => {
      // First check the type of the parameter, example, string, number, boolean
      // $4 => type of data, in this case a string
      // $3 => Type of data, in this case a number
      // $1 => Type of data, in this case a "boolean" (0 or 1)
      // $2 => Type of data, in this case a string
      const parameterValue = parameter.split('\n')[1].replace('\r', '').trim();
      
      parameters.push(parameterValue);

    });

    // If the forst parameter is a command, remove it
    if (parameters[0] === command) {
      parameters.shift();
    }
    
    switch (command) {
      case commandsInterface.ping:
        console.log("Received PING from client", socket.remoteAddress);
        socket.write("+PONG" + CRLF);
        break;
      case commandsInterface.echo:
        console.log("Received ECHO from client", socket.remoteAddress);
        // If have parameters, return the first one
        if (parameters.length > 0) {

          socket.write(`$${parameters[0].length}${CRLF}${parameters[0]}${CRLF}`);
        } else {
          socket.write(`$0${CRLF}${CRLF}`);
        }
        break;
      case commandsInterface.set:
        console.log("Received SET from client", socket.remoteAddress);
        // If have parameters, set the value
        if (parameters.length > 0) {
          values.set(parameters[0], parameters[1]);
          socket.write("+OK" + CRLF);
        } else {
          socket.write("-ERR" + CRLF);
        }
        break;
      case commandsInterface.get:
        console.log("Received GET from client", socket.remoteAddress);
        // If have parameters, get the value
        if (parameters.length > 0) {
          console.log(parameters);
          const value = values.get(parameters[0]);
          if (value) {
            socket.write(`$${value.length}${CRLF}${value}${CRLF}`);
          } else {
            socket.write("$-1" + CRLF);
          }
        } else {
          socket.write("$-1" + CRLF);
        }
        break;
      default:
        console.log("Command not found");
        break;
    }
  });
});

server.listen(6379, "127.0.0.1");