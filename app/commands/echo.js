const { formattedCommands } = require('../utils/utils') ;

module.exports = {
    name: 'echo',
    description: 'Command to test if the server is alive and if the client is sending the correct data or not',
    execute(socket, parameters) {
        console.log("Received ECHO from client", socket.remoteAddress);
        return socket.write(formattedCommands.echo(parameters));
    }
}