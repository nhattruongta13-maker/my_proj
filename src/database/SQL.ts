import {pool} from './db'

export const create = (() => pool.query(`CREATE TABLE users(
    id: SERIAL PRIMARY KEY,
    email: TEXT UNIQUE NOT NULL
    password: TEXT NOT NULL)`))