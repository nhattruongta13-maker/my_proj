import {pool} from './db'

export const insertUser = (async (email: string, password: string) => {
    await pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)
                RETURNING id, email, time`,
                [email, password]
    )
})