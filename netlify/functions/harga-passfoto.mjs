import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();
  const sql = getSQL();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM harga_passfoto WHERE id = 1`;
      if (rows.length === 0) {
        return ok({ basic: 15000, standard: 25000, premium: 45000 });
      }
      return ok(rows[0]);
    }

    if (req.method === 'PUT') {
      const data = await req.json();
      const result = await sql`
        UPDATE harga_passfoto SET
          basic = ${parseInt(data.basic) || 15000},
          standard = ${parseInt(data.standard) || 25000},
          premium = ${parseInt(data.premium) || 45000}
        WHERE id = 1
        RETURNING *
      `;
      return ok(result[0]);
    }

    return err('Method not allowed', 405);
  } catch (e) {
    return err(e.message);
  }
};
