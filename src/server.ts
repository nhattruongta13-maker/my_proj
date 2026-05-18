import express from 'express';
import cors from 'cors'
import authRouter from './route/auth'
import cookieParser from 'cookie-parser'

const allowed = ['https']
const app = express()
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowed.includes(origin)) return cb(null, true)
        return cb(new Error('CORS blocked'))
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1)

const PORT = process.env.PORT

app.use('/auth', authRouter)



app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})

