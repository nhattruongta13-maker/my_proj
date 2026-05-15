import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const createWebToken = (payload: {id: number}) => {
    const secret = process.env.JWT_SECRET
    const expiresIn = '15m'
    if (!secret) throw new Error("JWT_SECRET is missing. Blame yourself!")
    const token = jwt.sign(payload, secret, {expiresIn})
    return token
}

export const createRefreshToken = async () => {
    const token = crypto.randomBytes(64).toString('hex')
    const tokenHash = await bcrypt.hash(token, 10)
    return tokenHash
}
