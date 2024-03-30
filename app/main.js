// Require dependencies
const net = require("net");
const fs = require("fs");
const { join } = require("path");

const { defaultCommands, defaultValues, regex } = require("./interfaces/defaultvalues");

global.__basedir = __dirname;

const values = new Map();
const expire = new Map();
const commands = new Map();

var PORT = defaultValues.PORT;

for (let i = 0; i < process.argv.length; i++) {
  if ((process.argv[i] === '-p' || process.argv[i] === '--port') && process.argv[i + 1]) {
    PORT = process.argv[i + 1];
  }
}

// Require commands
const commandFiles = fs.readdirSync(join(__basedir, "commands")).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
  console.log(`Command ${command.name} loaded`);
}

// Handle connection
const server = net.createServer((socket) => {
  // Log when a client connects, and log the client address
  console.log("Client connected", socket.remoteAddress);

  // Handle ping
  socket.on("data", (data) => {

    const command = data.toString().match(regex.commandRegex)[0].split('\n')[1].replace('\r', '').toLowerCase();

    let parameters = [];

    data.toString().match(regex.parametersRegex)?.forEach((parameter) => parameters.push(parameter.split('\n')[1].replace('\r', '').trim()));

    // If the forst parameter is a command, remove it
    if (parameters[0] === command) parameters.shift();

    try {
      commands.get(command).execute(socket, parameters, defaultCommands, values, expire);
    } catch (error) {
      console.log(error);
      socket.write(defaultCommands.error);
    }
  });
});

server.listen(PORT, "127.0.0.1");