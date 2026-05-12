import express from 'express';
import cors from 'cors'
import {create} from './database/SQL'


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT
create()



app.listen(PORT, () => {
    console.log('The server is live baby')
})

