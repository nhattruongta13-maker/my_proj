import jwt from 'jsonwebtoken'
import {StringValue} from 'ms'

export const createWebToken = (payload: {id: number}) => {
    const secret = process.env.JWT_SECRET
    const expiresIn = process.env.JWT_EXPIRES_IN as StringValue || '7d'
    if (!secret) {
        throw new Error("JWT_SECRET is missing. Blame yourself!")
    }
    const token = jwt.sign(payload, secret, {expiresIn})
    return token
}