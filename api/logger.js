const winston = require('winston');

const util = require('util');

function transform(info, opts) {
    const args = info[Symbol.for('splat')];
    if (args) { info.message = util.format(info.message, ...args); }
    return info;
}

function utilFormatter() { return { transform }; }

// define the custom settings for each transport (file, console)
const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        colorize: true,
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            utilFormatter(),     // <-- this is what changed
            winston.format.colorize(),
            winston.format.printf(({ level, message, label, timestamp }) => `${timestamp} ${label || '-'} ${level}: ${message}`),
        )
    },
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    transports: [
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;