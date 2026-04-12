import { neon } from '@neondatabase/serverless';

export function getSQL() {
  // Pake URL bawaan Neon secara prioritas. 
  // NETLIFY_DATABASE_URL ini digenerate otomatis sama Neon extension.
  const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("Gembok database (URL) nggak nemu wak! Cek environment variable lu.");
  }
  
  return neon(dbUrl);
}

export function headers(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    ...extra
  };
}

export function ok(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: headers() });
}

export function err(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: headers() });
}

export function cors() {
  return new Response('', { status: 204, headers: headers() });
}
