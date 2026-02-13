import type { APIRoute } from 'astro';
import { AUTH_COOKIE } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(AUTH_COOKIE, { path: '/' });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
