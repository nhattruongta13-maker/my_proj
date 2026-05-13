import {insertUser} from '../database/SQL'
import bcrypt from 'bcrypt'

export const register = async (email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10)
    const newUser = await insertUser(email, password_hash)
    return newUser.rows[0]
}