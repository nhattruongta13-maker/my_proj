import cron from 'node-cron'
import {pool} from '../database/db'
import {deleteTokenByExpiry} from '../database/SQL'

export const startTokenGC = async () => {
    cron.schedule('0 * * * *', async () => {
        try {
            await deleteTokenByExpiry()
        }catch(err){
            console.log('Something unexpected happened')
        }
    })
}