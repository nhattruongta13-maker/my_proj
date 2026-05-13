import {insertUser} from '../database/SQL'

export const register = ((email: string, password: string) => {
    const newUser = insertUser(email, password)
    return newUser
})