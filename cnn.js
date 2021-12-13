const pgPromise = require('pg-promise')
const config={
    host:'localhost',
    port:'5433',
    database:'pizza',
    user:'postgres',
    password:'postgres'
}
const pgp = pgPromise({})
const db = pgp(config)
exports.db=db