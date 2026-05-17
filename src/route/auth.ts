import {register, login, skipLogin, verifyRefresh, rotateRefresh} from '../services/authService'
import {Router, Request, Response, NextFunction} from 'express'
import {errorHandler} from '../middlewares/errorHandler'
import {UserSchema, LoginSchema, IdSchema} from '../validation/schemas'
import {generateRequestId} from '../middlewares/generateRequestId'
import {AuthError, NosyError, AttackError} from '../errors/errors'
import {authHandler} from '../middlewares/authHandler'
import {rateLimiter} from '../middlewares/rateLimit'
import {createWebToken} from '../validation/createToken'
const router = Router()

router.use(generateRequestId)


router.get('/user/:id', authHandler, async (req: Request, res: Response, next: NextFunction) => {
    try{
    req.log.info({msg: 'skip.login.attempt'})
    const token = req.headers.authorization as string
    const user = await skipLogin(token)
    const req_id = IdSchema.parse({id: req.params.id})
    if (user.id !== req_id) throw new NosyError()
    req.log.info({msg: 'skip.login.success'})
    return res.status(200).json({msg: 'retrieve successful', user})
    }catch(err){
        req.log.error(err, 'skip.login.fail')
        next(err)
    }
})

router.post('/signup', rateLimiter, async (req: Request, res: Response, next: NextFunction) => {
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

router.post('/login', rateLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.log.info({req: req.body}, 'user.login.attempt')
        const {email, password} = LoginSchema.parse(req.body)
        const {accessToken} = await login(email, password, res)
        if (!accessToken) {
            throw new AuthError()
        }

        req.log.info({match: true}, 'user.login.success')
        return res.status(200).json({msg: "Login successful"})
    }catch(err){
            req.log.error(err, 'user.login.fail')
            next(err)
    }
})

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.refreshToken
        const result = await verifyRefresh(token, req)
        const newAccessToken = createWebToken(result.id)
        return res.status(200).json({msg: 'Refresh successful', newToken: newAccessToken})
    }catch(err: any){
        if (err instanceof AttackError){
            req.log.fatal('Critical attack! Revoked token reuse detected!')
        }else{
            req.log.error(err, err.message)
        }
        next(err)
    }
})

router.post('/newRefresh', async (req: Request, res: Response, next:NextFunction) => {
    try{
        const success =  await rotateRefresh(req.body.id, req, res)
        if (!success) throw new Error()
        req.log.info('New refresh provided')
        return res.status(200).json({msg: 'New refresh provided'})
    }catch(err: any){
        req.log.error(err, err.message)
        next(err)
    }
})

router.use(errorHandler)

export default router