import { neon } from '@neondatabase/serverless';
import 'dotenv/config'; // Pastiin lu udah install dotenv ya (npm install dotenv)

// Karena lu pake .env, pastiin manggil variabelnya bener
const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

async function setupDb() {
    try {
        console.log("Menghapus tabel lama jika ada...");
        await sql`DROP TABLE IF EXISTS orders`;
        await sql`DROP TABLE IF EXISTS service_requests`;
        await sql`DROP TABLE IF EXISTS products`;

        console.log("Membuat tabel products...");
        await sql`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        kategori VARCHAR(50) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        harga INTEGER NOT NULL,
        gambar VARCHAR(255),
        deskripsi TEXT
      );
    `;

        console.log("Membuat tabel orders...");
        await sql`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        nama_pelanggan VARCHAR(100) NOT NULL,
        alamat TEXT,
        metode_pembayaran VARCHAR(50),
        total_harga INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'Menunggu',
        tanggal_order TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        console.log("Membuat tabel service_requests...");
        await sql`
      CREATE TABLE service_requests (
        id SERIAL PRIMARY KEY,
        jenis_layanan VARCHAR(50) NOT NULL,
        nama_pelanggan VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(20),
        detail TEXT,
        file_url VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Menunggu',
        tanggal_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ); 
    `; // <-- NAH INI LU LUPA NUTUP KURUNGNYA ANJIR

        console.log("Setup database selesai, Nanda! Gass!");
    } catch (error) {
        console.error("Gagal setup database:", error);
    }
}

setupDb();