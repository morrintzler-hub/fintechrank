export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.thefintechrank.com/sitemap.xml',
    host: 'https://www.thefintechrank.com',
  }
}
