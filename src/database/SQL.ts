import {pool} from './db'

export const create = (() => pool.query(`CREATE TABLE users(
    Id SERIAL PRIMARY KEY,
    Email TEXT UNIQUE NOT NULL,
    Password_hash TEXT NOT NULL,
    Time DATE TIMESTAMPTZ.NOW())`))