import {insertUser, findUserByEmail, findUserById, insertTokenById, findTokenByHash} from '../database/SQL'
import bcrypt from 'bcrypt'
import {createWebToken, createRefreshToken} from '../validation/createToken'
import {AuthError, NosyError} from '../errors/errors'
import {jwtVerify} from '../validation/jwtVerify'
import crypto from 'crypto'
import {Response, Request} from 'express'

export const register = async (email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10)
    const newUser = await insertUser(email, password_hash)
    return newUser
}

export const login = async (email: string, password: string, res: Response) => {
    const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    const user = await findUserByEmail(email)
    const hashToCompare = user?.password_hash?? dummyHash
    const valid = await bcrypt.compare(password, hashToCompare)
    if (!valid || !user) throw new AuthError()
    const accessToken = createWebToken({id: user.id})
    const {refreshToken, tokenHash} = createRefreshToken()
    res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/refresh'
        })
    const insertToken = await insertTokenById(user.id, tokenHash)
    return {accessToken}
}

export const skipLogin = async (authorization: string) => {
    const token = authorization.split(' ')[1]
    const payload = jwtVerify(token)
    const user = await findUserById(payload.id)
    return user
}

export const verifyRefresh = async (req: Request) => {
    const token = req.cookies.refreshToken
    if (!token) throw new AuthError('Please login again') //check if the token is there
    const hashToCompare = crypto.hash('sha256', token, 'hex')
    const result = await findTokenByHash(hashToCompare)
    if(!result) throw new AuthError('Please login again') //check if someone the token is in the db
    return result
}