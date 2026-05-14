import {pino} from 'pino'

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: {
        pid: false,
    },
    redact: ['*.password', '*.password_hash', 'req.readers.authorization',],
    timestamp: pino.stdTimeFunctions.isoTime
})