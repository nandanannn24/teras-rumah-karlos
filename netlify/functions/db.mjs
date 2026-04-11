import { neon } from '@neondatabase/serverless';

export function getSQL() {
  return neon(process.env.DATABASE_URL);
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
