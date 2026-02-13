import type { APIRoute } from 'astro';
import { privateDecrypt, constants } from 'node:crypto';
import { AUTH_COOKIE, AUTH_PASSWORD, AUTH_USERNAME, PRIVATE_KEY_PEM } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const rawBody = (await request.json().catch(() => ({}))) as { payload?: string };
  const payload = rawBody.payload ?? '';

  if (!payload) {
    return new Response(JSON.stringify({ message: 'Missing encrypted payload.' }), { status: 400 });
  }

  try {
    const decrypted = privateDecrypt(
      {
        key: PRIVATE_KEY_PEM,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(payload, 'base64'),
    ).toString('utf-8');

    const { username, password } = JSON.parse(decrypted) as { username?: string; password?: string };

    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
      cookies.set(AUTH_COOKIE, 'ok', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: new URL(request.url).protocol === 'https:',
        maxAge: 60 * 60 * 8,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Invalid credentials.' }), { status: 401 });
  } catch {
    return new Response(JSON.stringify({ message: 'Unable to decrypt credentials.' }), { status: 400 });
  }
};
