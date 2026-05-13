import {insertUser, findUser} from '../database/SQL'
import bcrypt from 'bcrypt'

export const register = async (email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10)
    const newUser = await insertUser(email, password_hash)
    return newUser.rows[0]
}

export const login = async (email: string, password: string) => {
    const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    const user = await findUser(email)
    const hashToCompare = user?.rows[0].password_hash?? dummyHash
    const valid = await bcrypt.compare(password, hashToCompare)
    return valid
}