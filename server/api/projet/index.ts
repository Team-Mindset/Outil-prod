import { getDb } from '../../../server/utils/db'
export default defineEventHandler(async (event) => {
  const db = await getDb()
const [rows] = await db.query('SELECT * FROM Projets')
return Array.isArray(rows) ? rows : []
})