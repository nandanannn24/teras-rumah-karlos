import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL tidak ditemukan!');
  console.error('Buat file .env dengan isi: DATABASE_URL=postgresql://...');
  console.error('Atau set environment variable DATABASE_URL');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setup() {
  console.log('🔧 Membuat tabel...\n');

  await sql`
    CREATE TABLE IF NOT EXISTS products_atk (
      id SERIAL PRIMARY KEY,
      nama TEXT NOT NULL,
      harga INTEGER NOT NULL,
      kategori TEXT NOT NULL,
      img TEXT,
      deskripsi TEXT
    )
  `;
  console.log('✅ Tabel products_atk dibuat');

  await sql`
    CREATE TABLE IF NOT EXISTS products_buket (
      id SERIAL PRIMARY KEY,
      nama TEXT NOT NULL,
      harga INTEGER NOT NULL,
      kategori TEXT NOT NULL,
      img TEXT,
      deskripsi TEXT,
      badge TEXT DEFAULT ''
    )
  `;
  console.log('✅ Tabel products_buket dibuat');

  await sql`
    CREATE TABLE IF NOT EXISTS harga_fotokopi (
      id INTEGER PRIMARY KEY DEFAULT 1,
      fotokopi_bw INTEGER DEFAULT 200,
      print_bw INTEGER DEFAULT 500,
      print_warna INTEGER DEFAULT 1500,
      print_a3_bw INTEGER DEFAULT 1000,
      print_a3_warna INTEGER DEFAULT 3000,
      jilid_spiral INTEGER DEFAULT 5000,
      jilid_lakban INTEGER DEFAULT 3000,
      laminating INTEGER DEFAULT 2000
    )
  `;
  console.log('✅ Tabel harga_fotokopi dibuat');

  await sql`
    CREATE TABLE IF NOT EXISTS harga_passfoto (
      id INTEGER PRIMARY KEY DEFAULT 1,
      basic INTEGER DEFAULT 15000,
      standard INTEGER DEFAULT 25000,
      premium INTEGER DEFAULT 45000
    )
  `;
  console.log('✅ Tabel harga_passfoto dibuat');

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nama TEXT NOT NULL
    )
  `;
  console.log('✅ Tabel admin_users dibuat');

  console.log('\n📦 Mengisi data awal...\n');

  const atkCount = await sql`SELECT COUNT(*) as c FROM products_atk`;
  if (parseInt(atkCount[0].c) === 0) {
    const atkData = [
      ['Pulpen Pilot G2', 12000, 'tulis', 'public/atk/pulpen-pilot-g2.webp', 'Pulpen gel hitam 0.5mm'],
      ['Pensil 2B Faber-Castell', 5000, 'tulis', 'public/atk/pensil-2b-faber-castell.webp', 'Pensil ujian berkualitas'],
      ['Buku Tulis Sidu 58 lbr', 7000, 'kertas', 'public/atk/buku-tulis-sidu.webp', 'Buku tulis isi 58 lembar'],
      ['Kertas HVS A4 70gr (Rim)', 48000, 'kertas', 'public/atk/kertas-hvs-a4.webp', '1 rim / 500 lembar'],
      ['Spidol Snowman Hitam', 8000, 'tulis', 'public/atk/spidol-snowman.webp', 'Spidol whiteboard'],
      ['Penggaris Besi 30cm', 10000, 'sekolah', 'public/atk/penggaris-besi.webp', 'Penggaris stainless steel'],
      ['Stapler Kenko HD-10', 25000, 'kantor', 'public/atk/stapler-kenko.webp', 'Stapler ukuran kecil'],
      ['Map File Plastik F4', 3500, 'kantor', 'public/atk/map-file-plastik.webp', 'Map plastik warna-warni'],
      ['Penghapus Joyko EB-30', 3000, 'tulis', 'public/atk/penghapus-joyko.webp', 'Penghapus kuat dan bersih'],
      ['Binder Clip No. 111', 9000, 'kantor', 'public/atk/binder-clip.webp', 'Isi 12 pcs per kotak'],
      ['Buku Gambar A3', 15000, 'sekolah', 'public/atk/buku-gambar-a3.webp', 'Buku gambar besar 10 lembar'],
      ['Correction Tape Joyko', 6500, 'tulis', 'public/atk/correction-tape.webp', 'Tip-Ex cair roll 5mm'],
      ['Amplop Coklat A4', 2000, 'kantor', 'public/atk/amplop-coklat.webp', 'Amplop coklat per lembar'],
      ['Crayon Titi 12 Warna', 18000, 'sekolah', 'public/atk/crayon-titi.webp', 'Set crayon anak-anak'],
      ['Post-it Notes 3x3 inch', 11000, 'kantor', 'public/atk/post-it-notes.webp', 'Sticky notes warna kuning'],
      ['Kertas Folio Bergaris', 1500, 'kertas', 'public/atk/kertas-folio.webp', 'Per lembar, minimal 10'],
    ];
    for (const [nama, harga, kategori, img, deskripsi] of atkData) {
      await sql`INSERT INTO products_atk (nama, harga, kategori, img, deskripsi) VALUES (${nama}, ${harga}, ${kategori}, ${img}, ${deskripsi})`;
    }
    console.log(`✅ ${atkData.length} produk ATK ditambahkan`);
  } else {
    console.log('⏭️  Produk ATK sudah ada, skip');
  }

  const buketCount = await sql`SELECT COUNT(*) as c FROM products_buket`;
  if (parseInt(buketCount[0].c) === 0) {
    const buketData = [
      ['Bouquet Rose Classic', 150000, 'anniversary', 'public/buket/bouquet-rose-classic.webp', 'Rangkaian mawar merah premium dengan baby breath dan wrapping elegan.', 'Best Seller'],
      ['Wisuda Sunflower Joy', 120000, 'wisuda', 'public/buket/wisuda-sunflower-joy.webp', 'Buket sunflower cerah untuk merayakan momen kelulusan istimewa.', 'Popular'],
      ['Pink Lily Bouquet', 180000, 'anniversary', 'public/buket/pink-lily-bouquet.webp', 'Lily pink elegan dengan sentuhan eucalyptus dan pita satin.', ''],
      ['Birthday Rainbow Mix', 95000, 'ulang-tahun', 'public/buket/birthday-rainbow-mix.webp', 'Campuran bunga warna-warni ceria untuk ucapan ulang tahun.', ''],
      ['Wisuda Teddy Bear Combo', 200000, 'wisuda', 'public/buket/wisuda-teddy-bear.webp', 'Buket bunga + boneka teddy bear kecil, cocok untuk wisuda!', 'Premium'],
      ['Money Bouquet 50K', 85000, 'uang', 'public/buket/money-bouquet-50k.webp', 'Buket uang Rp50.000 (belum termasuk nominal uang). Kreatif dan unik!', ''],
      ['White Elegance', 165000, 'anniversary', 'public/buket/white-elegance.webp', 'Buket putih minimalis dengan baby breath dan daun hijau.', ''],
      ['Money Bouquet 100K', 120000, 'uang', 'public/buket/money-bouquet-100k.webp', 'Buket uang Rp100.000 cantik (belum termasuk nominal uang).', 'Popular'],
      ['Wisuda Dried Flower', 135000, 'wisuda', 'public/buket/wisuda-dried-flower.webp', 'Buket dried flower tahan lama, aesthetic untuk foto wisuda.', ''],
      ['Birthday Snack Bouquet', 75000, 'ulang-tahun', 'public/buket/birthday-snack-bouquet.webp', 'Buket snack cokelat & permen untuk pecinta kuliner.', 'Fun!'],
      ['Red Velvet Romance', 220000, 'anniversary', 'public/buket/red-velvet-romance.webp', '50 tangkai mawar merah premium dalam box elegant.', 'Luxury'],
      ['Wisuda Orchid Premium', 250000, 'wisuda', 'public/buket/wisuda-orchid-premium.webp', 'Anggrek ungu cantik dengan wrapping premium dan pita emas.', 'Premium'],
    ];
    for (const [nama, harga, kategori, img, deskripsi, badge] of buketData) {
      await sql`INSERT INTO products_buket (nama, harga, kategori, img, deskripsi, badge) VALUES (${nama}, ${harga}, ${kategori}, ${img}, ${deskripsi}, ${badge})`;
    }
    console.log(`✅ ${buketData.length} buket bunga ditambahkan`);
  } else {
    console.log('⏭️  Produk buket sudah ada, skip');
  }

  const hfCount = await sql`SELECT COUNT(*) as c FROM harga_fotokopi`;
  if (parseInt(hfCount[0].c) === 0) {
    await sql`INSERT INTO harga_fotokopi (id) VALUES (1)`;
    console.log('✅ Harga fotokopi default ditambahkan');
  } else {
    console.log('⏭️  Harga fotokopi sudah ada, skip');
  }

  const hpCount = await sql`SELECT COUNT(*) as c FROM harga_passfoto`;
  if (parseInt(hpCount[0].c) === 0) {
    await sql`INSERT INTO harga_passfoto (id) VALUES (1)`;
    console.log('✅ Harga pass foto default ditambahkan');
  } else {
    console.log('⏭️  Harga pass foto sudah ada, skip');
  }

  const adminCount = await sql`SELECT COUNT(*) as c FROM admin_users`;
  if (parseInt(adminCount[0].c) === 0) {
    await sql`INSERT INTO admin_users (username, password, nama) VALUES ('admin', 'admin123', 'Karlos (Admin)')`;
    await sql`INSERT INTO admin_users (username, password, nama) VALUES ('staff', 'staff123', 'Staff Toko')`;
    console.log('✅ 2 akun admin ditambahkan');
  } else {
    console.log('⏭️  Admin users sudah ada, skip');
  }

  console.log('\n🎉 Setup database selesai! Siap deploy ke Netlify.');
}

setup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
