import {register} from '../services/db_manip'
import {Router, Request, Response, NextFunction} from 'express'
import {errorHandler} from '../middlewares/errorHandler'
import {UserSchema} from '../schemas/validation'
import {generateRequestId} from '../middlewares/generateRequestId'


const router = Router()

router.use(generateRequestId)

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try{
    const {email, password} = UserSchema.parse(req.body)
    const newUser = await register(email, password)
    return res.status(201).json({msg: "Account created",
                                 info: newUser
    })
    }catch(err){
        next(err)
    }
})

router.use(errorHandler)

export default router