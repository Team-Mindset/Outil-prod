import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  // 1. Cherche d'abord dans le header Authorization
  let token: string | undefined

  const authHeader = getHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  // 2. Sinon, cherche dans le cookie 'client_token'
  if (!token) {
    const cookieHeader = getHeader(event, 'cookie')
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=')
        return [k, decodeURIComponent(v.join('='))]
      }))
      if (cookies.client_token) {
        token = cookies.client_token
      }
    }
  }

  // 3. Si on a un token, vérifie-le et place l'utilisateur en contexte
  if (token) {
    try {
const decoded = jwt.verify(token, process.env.JWT_SECRET!)
event.context.user = { id: decoded.id } // ou id, username, rang si tu veux
    } catch (err) {
      console.warn('Token invalide')
    }
  }
  // console.log('[AUTH] middleware appelé')
})