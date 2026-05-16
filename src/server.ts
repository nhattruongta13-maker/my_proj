import express from 'express';
import cors from 'cors'
import authRouter from './route/auth'
import cookieParser from 'cookie-parser'



const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1)

const PORT = process.env.PORT
app.use('/auth', authRouter)



app.listen(PORT, () => {
    console.log('The server is live baby')
})

