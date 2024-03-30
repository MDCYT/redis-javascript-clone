const { formattedCommands } = require('../utils/utils');

module.exports = {
    name: 'get',
    description: 'Command to get the value of a key',
    execute(socket, parameters, defaultCommands, values, expire) {
        console.log("Received GET from client", socket.remoteAddress);
        // If have parameters, get the value
        if (parameters.length <= 0) return socket.write(defaultCommands.null);

        const [key] = parameters;

        const expiration = expire.get(key);
        if (expiration && expiration < new Date().getTime()) {
            values.delete(parameters[0]);
            expire.delete(parameters[0]);
        }

        const value = values.get(key);

        if (!value) return socket.write(defaultCommands.null);

        return socket.write(formattedCommands.get(value));
    }
}