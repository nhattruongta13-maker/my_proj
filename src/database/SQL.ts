import {pool} from './db'

export const create = (() => pool.query(`CREATE TABLE users(
    id: serial PRIMARY KEY,
    email: text UNIQUE NOT NULL,
    password: text NOT NULL)`))