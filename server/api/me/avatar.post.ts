// server/api/me/avatar.post.ts
import { promises as fs } from 'fs'
import { join } from 'path'
import { getDb } from '../../../server/utils/db'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Non connecté' })
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'avatar')
  if (!file) throw createError({ statusCode: 400, message: 'Fichier manquant' })

  const db = getDb()

  // 1. On récupère l'ancien avatar en BDD (toujours mieux que le context, car il est à jour)
  const [users] = await db.execute('SELECT avatarProd FROM users WHERE id = ?', [user.id])
  const oldAvatar = users[0]?.avatarProd

  // 2. Supprimer l'ancien fichier S'IL existe, ET que ce n'est pas le default
  if (
    oldAvatar &&
    oldAvatar !== '/default-avatar.png' &&
    oldAvatar.startsWith('/uploads/') // sécurité : ne supprime que dans /uploads
  ) {
    const oldPath = join(process.cwd(), 'public', oldAvatar)
    try {
      await fs.unlink(oldPath)
    } catch (e) {
      // Si le fichier n'existe pas, on ignore
    }
  }

  // 3. On continue comme avant : enregistrer le nouveau fichier
  const uploadDir = join(process.cwd(), 'public/uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  const timestamp = Date.now()
  const filename = `${user.id}_avatar_${timestamp}.png`
  const filePath = join(uploadDir, filename)
  await fs.writeFile(filePath, file.data)
  const url = `/uploads/${filename}`

  // 4. Mise à jour du champ avatarProd dans la BDD
  await db.execute('UPDATE users SET avatarProd = ? WHERE id = ?', [url, user.id])

  // 5. Retourner le nouveau chemin
  return { success: true, url }
})