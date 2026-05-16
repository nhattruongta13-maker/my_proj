import {pool} from './db'

export const insertUser = (async (email: string, password: string) => {
    const result = await pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)
                RETURNING id, email, time`,
                [email, password]
    )
    return result.rows[0]
})

export const findUserByEmail = async (email: string) => {
    const result = await pool.query(`SELECT id, email, password_hash 
                                FROM users
                                WHERE email = $1`,
                                [email])
    return result.rows[0]
}

export const findUserById = async (id: number) => {
    const result = await pool.query(`SELECT id, email, time
                                FROM users
                                WHERE id = $1`,
                                [id])
    return result.rows[0]
}

export const insertTokenById = async (id: number, refreshToken: string) => {
    const result = await pool.query(`INSERT INTO refreshtoken (id, token)
                                    VALUES ($1, $2)
                                    RETURNING id, token`,
                                    [id, refreshToken])
    return result.rows[0]
}

export const findTokenById = async (id: number) => {
    const result = await pool.query(`SELECT token 
                                     FROM refreshtoken
                                     WHERE id = $1`,
                                     [id])
    return result.rows[0]
}