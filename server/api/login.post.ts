import { getDb } from '../../server/utils/db'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  const db = getDb() 
  const [rows]: any = await db.execute('SELECT * FROM users WHERE username = ?', [username])
  const user = rows[0]
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

const hashedPassword = user.password.replace(/^\$2y\$/, '$2a$') 
const valid = await bcrypt.compare(password, hashedPassword)
  if (!valid) throw createError({ statusCode: 401, message: 'Wrong password' })

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  setCookie(event, 'token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  return { token }
  
})