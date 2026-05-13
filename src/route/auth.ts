import {register} from '../services/db_manip'
import {Router, Request, Response, NextFunction} from 'express'
import {ZodError} from 'zod'
import {UserSchema} from '../schemas/validation'

const router = Router()

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    try{
    const sanitziedInput = UserSchema.parse(req.body)
    }catch(err){
        if (err instanceof ZodError){
            return res.status(400).json({error: err.issues})
        }
    }
})

router.use()