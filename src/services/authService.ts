import {insertUser, findUser} from '../database/SQL'
import bcrypt from 'bcrypt'
import {createWebToken} from '../validation/createWebToken'
import {AuthError} from '../errors/errors'


export const register = async (email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10)
    const newUser = await insertUser(email, password_hash)
    return newUser
}

export const login = async (email: string, password: string) => {
    const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    const user = await findUser(email)
    const hashToCompare = user?.password_hash?? dummyHash
    const valid = await bcrypt.compare(password, hashToCompare)
    if (!valid || !user) throw new AuthError()
    const token = createWebToken(user.id)
    return token
}