import { getSQL, ok, err, cors } from './db.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return cors();

  try {
    if (req.method === 'POST') {
      const { username, password } = await req.json();
      if (!username || !password) return err('Username dan password wajib diisi', 400);

      const sql = getSQL();
      const users = await sql`
        SELECT id, username, nama FROM admin_users 
        WHERE username = ${username} AND password = ${password}
      `;

      if (users.length === 0) {
        return err('Username atau password salah!', 401);
      }

      return ok({ success: true, nama: users[0].nama, username: users[0].username });
    }

    return err('Method not allowed', 405);
  } catch (e) {
    return err(e.message);
  }
};
