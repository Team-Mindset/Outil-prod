import { getDb } from '../../server/utils/db'

export default defineEventHandler(async (event) => {
  const contextUser = event.context.user
  if (!contextUser) throw createError({ statusCode: 401, message: 'Non connecté' })

  const db = getDb()
  const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [contextUser.id])
  const user = users[0]
  if (!user) throw createError({ statusCode: 404, message: 'Utilisateur introuvable' })
  return user
})