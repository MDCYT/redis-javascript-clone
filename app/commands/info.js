const { formattedCommands } = require('../utils/utils');

module.exports = {
    name: 'info',
    description: 'Command to get information about the server',
    execute(socket, parameters, defaultCommands) {
        console.log("Received INFO from client", socket.remoteAddress);
        return socket.write(formattedCommands.info(socket.isMaster));
    }
}