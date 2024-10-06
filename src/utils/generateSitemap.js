import { writeFileSync } from 'fs';
import { globby } from 'globby';

async function generateSitemap() {
  const pages = await globby([
    'src/pages/**/*.jsx',
    '!src/pages/_*.jsx',
    '!src/pages/api',
  ]);

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page
            .replace('src/pages', '')
            .replace('.jsx', '')
            .replace('/index', '');
          return `
            <url>
              <loc>https://yourdomain.com${path}</loc>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  writeFileSync('public/sitemap.xml', sitemap);
}

export default generateSitemap;