import { getDb } from '../../../server/utils/db'

export default defineEventHandler(async (event) => {
  const projetId = event.context.params.projet_id
  const method = event.req.method

  const db = await getDb()

  if (method === 'GET') {
    // Récupérer le cahier des charges par projet_id
    const [rows] = await db.query('SELECT * FROM cahier_des_charges WHERE projet_id = ?', [projetId])
    return rows[0] || null
  } else if (method === 'PATCH') {
    const body = await readBody(event)
    const { data_json, last_saved_at, userId_save } = body

    if (!data_json) {
      return { error: 'data_json is required' }
    }

    await db.query(
      'UPDATE cahier_des_charges SET data_json = ?, last_saved_at = ?, userId_save = ? WHERE projet_id = ?',
      [data_json, last_saved_at || null, userId_save || null, projetId]
    )

    return { success: true }
  } else {
    // Méthode non supportée
    event.res.statusCode = 405
    return { error: `Method ${method} not allowed` }
  }
})