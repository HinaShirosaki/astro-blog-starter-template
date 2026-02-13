import type { APIRoute } from 'astro';
import { PUBLIC_KEY_PEM } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ publicKey: PUBLIC_KEY_PEM }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
