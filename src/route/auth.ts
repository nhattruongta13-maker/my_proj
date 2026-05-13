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
    req.log.info({req_body: req.body}, 'user.signup.attempt')
    const newUser = await register(email, password)
    req.log.info({user: newUser}, 'user.signup.success')
    return res.status(201).json({msg: "Account created",
                                 info: newUser
    })
    }catch(err){
        req.log.error(err, 'user.signup.fail')
        next(err)
    }
})

router.use(errorHandler)

export default router