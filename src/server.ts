import express from 'express';
import cors from 'cors'
import authRouter from './route/auth'
import {createTokenTable} from './database/SQL'



const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT
createTokenTable()
app.use('/auth', authRouter)



app.listen(PORT, () => {
    console.log('The server is live baby')
})

