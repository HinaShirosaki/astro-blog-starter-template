import type { APIRoute } from 'astro';
import { privateDecrypt, constants } from 'node:crypto';
import { AUTH_COOKIE, AUTH_ROLE_COOKIE, AUTH_USERS, PRIVATE_KEY_PEM } from '../../../lib/auth';

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
    const account = Object.values(AUTH_USERS).find(
      (candidate) => candidate.username === username && candidate.password === password,
    );

    if (account) {
      const secure = new URL(request.url).protocol === 'https:';
      const options = {
        path: '/',
        httpOnly: true,
        sameSite: 'strict' as const,
        secure,
        maxAge: 60 * 60 * 8,
      };

      cookies.set(AUTH_COOKIE, 'ok', options);
      cookies.set(AUTH_ROLE_COOKIE, account.role, options);

      return new Response(JSON.stringify({ success: true, role: account.role }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Invalid credentials.' }), { status: 401 });
  } catch {
    return new Response(JSON.stringify({ message: 'Unable to decrypt credentials.' }), { status: 400 });
  }
};
