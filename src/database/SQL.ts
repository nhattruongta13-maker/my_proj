import {pool} from './db'

export const insertUser = ((email: string, password: string) => {
    pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)
                RETURNG id, email, time`,
                [email, password]
    )
})