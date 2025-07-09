import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) return

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    event.context.user = decoded
  } catch (err) {
    console.warn('Token invalide')
  }
})