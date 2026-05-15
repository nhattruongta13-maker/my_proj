import jwt from 'jsonwebtoken'
import {StringValue} from 'ms'

export const createWebToken = (payload: {id: number}) => {
    const secret = process.env.JWT_SECRET
    const expiresIn = '15m'
    if (!secret) {
        throw new Error("JWT_SECRET is missing. Blame yourself!")
    }
    const token = jwt.sign(payload, secret, {expiresIn})
    return token
}

