import {jwtVerify} from '../validation/jwtVerify'
import {Request, Response, NextFunction} from 'express'
import {findUserById} from '../database/SQL'

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) throw new Error('Missing token dude')
    next()
}
