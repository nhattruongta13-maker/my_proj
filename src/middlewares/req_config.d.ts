import {Logger} from 'pino'
import {randomUUID} from 'crypto'
import {logger} from '../lib/logger'
import {Request, Response, NextFunction} from 'express'

declare global{
    namespace Express{
        interface Request{
            id: string
            log: Logger
        }
    }
}

export const generateRequestId = ((req: Request, res: Response, next:NextFunction) => {
    req.id = req.headers['x-request-header'] as string || randomUUID()
    req.log = logger.child({req_id: req.id})
    res.setHeader('X-Request-Id', req.id)
    next()
})