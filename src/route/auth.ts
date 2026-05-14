import {register, login, skipLogin} from '../services/authService'
import {Router, Request, Response, NextFunction} from 'express'
import {errorHandler} from '../middlewares/errorHandler'
import {UserSchema, LoginSchema} from '../validation/schemas'
import {generateRequestId} from '../middlewares/generateRequestId'
import {AuthError} from '../errors/errors'
import {authHandler} from '../middlewares/authHandler'

const router = Router()

router.use(generateRequestId)

router.get('/user/:id', authHandler, async (req: Request, res: Response, next: NextFunction) => {
    try{
    req.log.info({msg: 'skip.login.attempt'})
    const token = req.headers.authorization as string
    const user = await skipLogin(token)
    req.log.info({msg: 'skip.login.success'})
    return res.status(200).json({msg: 'retrieve successful', user})
    }catch(err){
        req.log.error(err, 'skip.login.fail')
        next(err)
    }
})

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
        const token = await login(email, password)
        if (!token) {
            throw new AuthError()
        }
        req.log.info({match: true}, 'user.login.success')
        return res.status(200).json({msg: "Login successful", token})
    }catch(err){
            req.log.error(err, 'user.login.fail')
            next(err)
    }
})

router.use(errorHandler)

export default router