import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();
  const sql = getSQL();

  try {
    if (req.method === 'GET') {
      const products = await sql`SELECT * FROM products_atk ORDER BY id`;
      return ok(products);
    }

    if (req.method === 'POST') {
      const { nama, harga, kategori, img, deskripsi } = await req.json();
      if (!nama || !harga || !kategori) return err('nama, harga, kategori wajib diisi', 400);
      const result = await sql`
        INSERT INTO products_atk (nama, harga, kategori, img, deskripsi)
        VALUES (${nama}, ${parseInt(harga)}, ${kategori}, ${img || ''}, ${deskripsi || ''})
        RETURNING *
      `;
      return ok(result[0]);
    }

    if (req.method === 'PUT') {
      const { id, nama, harga, kategori, img, deskripsi } = await req.json();
      if (!id) return err('id wajib diisi', 400);
      const result = await sql`
        UPDATE products_atk 
        SET nama = ${nama}, harga = ${parseInt(harga)}, kategori = ${kategori}, 
            img = ${img || ''}, deskripsi = ${deskripsi || ''}
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;
      return ok(result[0]);
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return err('id wajib diisi', 400);
      await sql`DELETE FROM products_atk WHERE id = ${parseInt(id)}`;
      return ok({ success: true });
    }

    return err('Method not allowed', 405);
  } catch (e) {
    return err(e.message);
  }
};
