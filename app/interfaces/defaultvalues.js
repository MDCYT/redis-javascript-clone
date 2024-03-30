const CRLF = '\r\n'

const defaultCommands = {
    pong: `+PONG${CRLF}`,
    ok: `+OK${CRLF}`,
    noEcho: `$0${CRLF}${CRLF}`,
    error: `-ERR${CRLF}`,
    null: `$-1${CRLF}`,
    info: `$11${CRLF}role:master${CRLF}`,
}

const defaultValues = {
    PORT: 6379,
}

const regex = {
    commandRegex: /\$[0-9]+\r\n([a-zA-Z]+)\r\n/g,
    parametersRegex: /\$[0-9]+\r\n([a-zA-Z0-9.-]+)\r\n/g
}

module.exports = {
    regex,
    defaultCommands,
    defaultValues,
    CRLF
}