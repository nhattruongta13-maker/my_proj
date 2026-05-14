import {jwtVerify} from '../validation/jwtVerify'
import {Request, Response, NextFunction} from 'express'

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) throw new Error('Missing token dude')
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwtVerify(token)
    
}
