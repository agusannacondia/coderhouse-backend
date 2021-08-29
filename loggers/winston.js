import winston from "winston";

const loggerConsole = winston.createLogger({
    level: "debug",
    transports: [new winston.transports.Console({ level: "debug" })],
});

const loggerWarn = winston.createLogger({
    level: "warn",
    transports: [
        new winston.transports.File({
            filename: "warnings.log",
            level: "warn",
        }),
        new winston.transports.Console({ level: "warn" }),
    ],
});

const loggerError = winston.createLogger({
    level: "error",
    transports: [
        new winston.transports.File({ filename: "errors.log", level: "error" }),
        new winston.transports.Console({ level: "error" }),
    ],
});

export { loggerConsole, loggerError, loggerWarn };
