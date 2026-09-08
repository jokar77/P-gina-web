import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const cuerpo = [
    'User-agent: *',
    'Allow: /',
    '',
    site ? `Sitemap: ${new URL('sitemap-index.xml', site).href}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(cuerpo + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
