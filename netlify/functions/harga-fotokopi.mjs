import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();
  const sql = getSQL();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM harga_fotokopi WHERE id = 1`;
      if (rows.length === 0) {
        return ok({ fotokopi_bw: 200, print_bw: 500, print_warna: 1500, print_a3_bw: 1000, print_a3_warna: 3000, jilid_spiral: 5000, jilid_lakban: 3000, laminating: 2000 });
      }
      return ok(rows[0]);
    }

    if (req.method === 'PUT') {
      const data = await req.json();
      const result = await sql`
        UPDATE harga_fotokopi SET
          fotokopi_bw = ${parseInt(data.fotokopi_bw) || 200},
          print_bw = ${parseInt(data.print_bw) || 500},
          print_warna = ${parseInt(data.print_warna) || 1500},
          print_a3_bw = ${parseInt(data.print_a3_bw) || 1000},
          print_a3_warna = ${parseInt(data.print_a3_warna) || 3000},
          jilid_spiral = ${parseInt(data.jilid_spiral) || 5000},
          jilid_lakban = ${parseInt(data.jilid_lakban) || 3000},
          laminating = ${parseInt(data.laminating) || 2000}
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
