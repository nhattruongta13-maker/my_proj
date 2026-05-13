import {register, login} from '../services/db_manip'
import {Router, Request, Response, NextFunction} from 'express'
import {errorHandler} from '../middlewares/errorHandler'
import {UserSchema, LoginSchema} from '../schemas/validation'
import {generateRequestId} from '../middlewares/generateRequestId'
import {AuthError} from '../errors/errors'


const router = Router()

router.use(generateRequestId)

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try{
    const {email, password} = UserSchema.parse(req.body)
    req.log.info({user: req.body}, 'user.signup.attempt')
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

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.log.info({req: req.body}, 'user.login.attempt')
        const {email, password} = LoginSchema.parse(req.body)
        const valid = login(email, password)
        if (!valid) {
            throw new AuthError()
        }
        req.log.info({match: valid}, 'user.login.success')
        return res.status(200).json({msg: "Login successful"})
    }catch(err){
            req.log.error(err, 'user.login.fail')
            next(err)
    }
})

router.use(errorHandler)

export default router