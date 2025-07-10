import { getDb } from '../../../server/utils/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const db = await getDb()
  const [rows] = await db.query('SELECT * FROM Projets WHERE id_projet = ?', [id])
  return rows[0] || null
})