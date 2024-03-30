module.exports = {
    name: 'ping',
    description: 'Command to test if the server is alive',
    execute(socket, parameters, defaultCommands) {
        console.log("Received PING from client", socket.remoteAddress);
        return socket.write(defaultCommands.pong);
    }
}