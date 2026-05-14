import {pool} from './db'

export const insertUser = (async (email: string, password: string) => {
    const result = await pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)
                RETURNING id, email, time`,
                [email, password]
    )
    return result.rows[0]
})

export const findUser = async (email: string) => {
    const result = await pool.query(`SELECT id, email, password_hash 
                                FROM users
                                WHERE email = $1`,
                                [email])
    return result.rows[0]
}