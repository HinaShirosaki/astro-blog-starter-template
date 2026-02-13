import { defineMiddleware } from 'astro:middleware';
import { AUTH_COOKIE } from './lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/public-key'];

export const onRequest = defineMiddleware(async ({ url, cookies }, next) => {
  const path = url.pathname;

  if (path.startsWith('/_astro') || path.startsWith('/favicon') || path.startsWith('/fonts')) {
    return next();
  }

  if (PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath))) {
    return next();
  }

  if (!cookies.get(AUTH_COOKIE)?.value) {
    return Response.redirect(new URL('/login', url));
  }

  return next();
});
