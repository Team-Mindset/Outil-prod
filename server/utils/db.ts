import mysql from 'mysql2/promise'

let pool: mysql.Pool

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: '185.207.226.14',
      user: 'vesqbc_producti_db',
      password: '7f-yp!QZWOg6_%49',
      database: 'vesqbc_producti_db',
      waitForConnections: true,
      connectionLimit: 10,
    })
  }
  return pool
}