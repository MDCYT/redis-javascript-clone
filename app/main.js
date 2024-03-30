// Require dependencies
const net = require("net");
const commandsInterface = require("./interfaces/commands");

const CRLF = '\r\n'

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
      const parameterType = parameter.split('\n')[0].replace('$', '').trim();
      const parameterValue = parameter.split('\n')[1].replace('\r', '').trim();

      switch (parameterType) {
        case '1':
          parameters.push(parameterValue === '1' ? true : false);
          break;
        case '2':
          parameters.push(parameterValue);
          break;
        case '3':
          parameters.push(parseInt(parameterValue));
          break;
        case '4':
          parameters.push(parameterValue);
          break;
        default:
          parameters.push(parameterValue);
          break;
      }
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
      default:
        console.log("Command not found");
        break;
    }
  });
});

server.listen(6379, "127.0.0.1");