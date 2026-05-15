import express from 'express';
import cors from 'cors'
import authRouter from './route/auth'




const app = express()
app.use(cors())
app.use(express.json())
app.set('trust proxy', 1)

const PORT = process.env.PORT
app.use('/auth', authRouter)



app.listen(PORT, () => {
    console.log('The server is live baby')
})

