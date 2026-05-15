import {insertUser, findUserByEmail, findUserById, insertTokenById} from '../database/SQL'
import bcrypt from 'bcrypt'
import {createWebToken, createRefreshToken} from '../validation/createToken'
import {AuthError} from '../errors/errors'
import {jwtVerify} from '../validation/jwtVerify'
import crypto from 'crypto'


export const register = async (email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10)
    const newUser = await insertUser(email, password_hash)
    return newUser
}

export const login = async (email: string, password: string) => {
    const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    const user = await findUserByEmail(email)
    const hashToCompare = user?.password_hash?? dummyHash
    const valid = await bcrypt.compare(password, hashToCompare)
    if (!valid || !user) throw new AuthError()
    const accessToken = createWebToken({id: user.id})
    const refreshToken = createRefreshToken({id: user.id})
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const insertToken = await insertTokenById(user.id, refreshTokenHash)
    const tokens: Tokens = {accessToken, refreshTokenHash}
    return tokens
}

export const skipLogin = async (authorization: string) => {
    const token = authorization.split(' ')[1]
    const payload = jwtVerify(token)
    const user = await findUserById(payload.id)
    return user
}