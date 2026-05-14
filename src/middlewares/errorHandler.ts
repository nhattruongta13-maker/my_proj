import {Request, Response, NextFunction} from 'express'
import {ZodError} from 'zod'
import {AuthError} from '../errors/errors'
import jwt from 'jsonwebtoken'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError){
        return res.status(400).json({error: err.issues})
    }else if(err.code === '23505'){
        return res.status(409).json({error: "Email already exists"})
    }else if(err instanceof AuthError){
        return res.status(401).json({error: err.message})
    }
    else{
        return res.status(500).json({err: "Something unexpected happened"})
    }
}