import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();
  const sql = getSQL();

  try {
    if (req.method === 'GET') {
      const products = await sql`SELECT * FROM products_buket ORDER BY id`;
      return ok(products);
    }

    if (req.method === 'POST') {
      const { nama, harga, kategori, img, deskripsi, badge } = await req.json();
      if (!nama || !harga || !kategori) return err('nama, harga, kategori wajib diisi', 400);
      const result = await sql`
        INSERT INTO products_buket (nama, harga, kategori, img, deskripsi, badge)
        VALUES (${nama}, ${parseInt(harga)}, ${kategori}, ${img || ''}, ${deskripsi || ''}, ${badge || ''})
        RETURNING *
      `;
      return ok(result[0]);
    }

    if (req.method === 'PUT') {
      const { id, nama, harga, kategori, img, deskripsi, badge } = await req.json();
      if (!id) return err('id wajib diisi', 400);
      const result = await sql`
        UPDATE products_buket 
        SET nama = ${nama}, harga = ${parseInt(harga)}, kategori = ${kategori},
            img = ${img || ''}, deskripsi = ${deskripsi || ''}, badge = ${badge || ''}
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;
      return ok(result[0]);
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return err('id wajib diisi', 400);
      await sql`DELETE FROM products_buket WHERE id = ${parseInt(id)}`;
      return ok({ success: true });
    }

    return err('Method not allowed', 405);
  } catch (e) {
    return err(e.message);
  }
};
