module.exports = {
    name: 'set',
    description: 'Command to set a value in the server',
    execute(socket, parameters, defaultCommands, values, expire) {
        console.log("Received SET from client", socket.remoteAddress);
        // If have parameters, set the value
        if (parameters.length <= 0) return socket.write(defaultCommands.error)
        const [key, value, ...rest] = parameters
        values.set(key, value)
        // Check if the rest of parameters are expiration, if so, set the expiration, is like a TTL, ["px", "1000"], in a future, we can add more options
        if (rest.length > 0) {
            for (let i = 0; i < rest.length; i += 2) {
                if (rest[i] === "px" && !isNaN(rest[i + 1])) {
                    expire.set(key, new Date().getTime() + parseInt(rest[i + 1]))
                } else {
                    return socket.write(defaultCommands.error)
                }
            }
        }
        return socket.write(defaultCommands.ok);
    }
}