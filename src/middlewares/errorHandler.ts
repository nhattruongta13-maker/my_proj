import {Request, Response, NextFunction} from 'express'
import {ZodError} from 'zod'
import {AuthError, NosyError} from '../errors/errors'
import jwt from 'jsonwebtoken'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError){
        return res.status(400).json({error: err.issues})
    }else if(err.code === '23505'){
        return res.status(409).json({error: "Email already exists"})
    }else if(err instanceof AuthError){
        return res.status(401).json({error: err.message})
    }else if(err instanceof jwt.TokenExpiredError){
        return res.status(401).json({error: 'You left too long'})
    }else if(err instanceof jwt.JsonWebTokenError){
        return res.status(401).json({error: "Stop hacking dude"})
    }else if(err instanceof NosyError){
        return res.status(403).json({error: err.message})
    }
    else{
        return res.status(500).json({err: "Something unexpected happened"})
    }
}