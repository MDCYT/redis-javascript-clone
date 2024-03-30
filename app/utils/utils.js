const { CRLF, defaultCommands } = require('../interfaces/defaultvalues');

const formattedCommands = {
    echo(parameters) {
        if (parameters.length <= 0) return defaultCommands.noEcho;
        return `$${parameters[0].length}${CRLF}${parameters[0]}${CRLF}`;
    },
    get(value) {
        return `$${value.length}${CRLF}${value}${CRLF}`;
    },
    info(isMaster) {
        return isMaster ? defaultCommands.info.master : defaultCommands.info.slave;
    }
}

module.exports = {
    formattedCommands
}