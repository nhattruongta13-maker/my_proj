import {register} from '../services/db_manip'
import {Router, Request, Response, NextFunction} from 'express'
import {ZodError} from 'zod'
import {UserSchema} from '../schemas/validation'

const router = Router()

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try{
    const {email, password} = UserSchema.parse(req.body)
    const newUser = await register(email, password)
    return res.status(200).json({msg: "Account created"})
    }catch(err){
        if (err instanceof ZodError){
            return res.status(400).json({error: err.issues})
        }
    }
})

router.use()