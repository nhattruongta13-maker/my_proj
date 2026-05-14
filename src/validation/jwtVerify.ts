import jwt from 'jsonwebtoken'

const jwtVerify = (token: string) => {
    const secret = process.env.JWT_SECRET
    if (!token) throw new Error('Missing token dude')
    if (!secret) throw new Error('Missing secret. Go blame yourself!')
    const payload = jwt.verify(token, secret) as {id: number}
    return payload
}