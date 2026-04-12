import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();
  
  try {
    const sql = getSQL();

    // Kalo Admin mau liat daftar pesanan
    if (req.method === 'GET') {
      const pesanan = await sql`SELECT * FROM pesanan ORDER BY waktu_pesan DESC`;
      return ok(pesanan);
    }

    // Kalo User ngeklik tombol pesen
    if (req.method === 'POST') {
      const { layanan, nama_pelanggan, detail } = await req.json();
      if (!layanan || !detail) return err('Layanan dan detail wajib diisi', 400);
      
      const result = await sql`
        INSERT INTO pesanan (layanan, nama_pelanggan, detail)
        VALUES (${layanan}, ${nama_pelanggan || 'Guest'}, ${detail})
        RETURNING *
      `;
      return ok(result[0]);
    }

    // Nanti buat admin update status (Menunggu -> Diproses)
    if (req.method === 'PUT') {
      const { id, status } = await req.json();
      const result = await sql`UPDATE pesanan SET status = ${status} WHERE id = ${id} RETURNING *`;
      return ok(result[0]);
    }

    return err('Method not allowed', 405);
  } catch (e) {
    return err(e.message);
  }
};
