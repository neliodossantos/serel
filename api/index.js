import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load HTML template
let template;
try {
  template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
} catch {
  template = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
}

// Sanitize text to prevent XSS
const sanitize = (text) =>
  text
    ? String(text)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

// Generate meta tags
const generateMetaTags = (data) => {
  const {
    title,
    description,
    image,
    url,
    type,
    publishedTime = null,
    author = null,
  } = data;
  return `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:secure_url" content="${image}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">
    <meta property="og:site_name" content="Serel">
    <meta property="og:locale" content="pt_AO">
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}">` : ''}
    ${author ? `<meta property="article:author" content="${author}">` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${title}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${url}">
  `;
};

export default async (req, res) => {
  const url = req.url || '/';
  const baseUrl = process.env.BASE_URL || 'https://serel-frontend-delta.vercel.app';
  let html = template;
  let metaData = {
    title: 'Serel - Compartilhe as suas experiências',
    description:
      'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
    image: `${baseUrl}/banner_serel.jpg`,
    url: `${baseUrl}${url}`,
    type: 'website',
  };

  try {
    const { pathname } = new URL(url, baseUrl);
    const parts = pathname.split('/').filter(Boolean);

    // Homepage
    if (pathname === '/' || pathname === '') {
      metaData = {
        title: 'Serel - Compartilhe as suas experiências',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: `${baseUrl}/banner_serel.jpg`,
        url: `${baseUrl}/`,
        type: 'website',
      };
    }
    // Company page
    else if (parts[0] === 'overview' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2];
      if (companyId) {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (company && company.id) {
          const logo =
            company.logo && company.logo.startsWith('http')
              ? company.logo
              : `${baseUrl}${company.logo || '/banner_serel.jpg'}`; // Fallback to banner if no logo
          metaData = {
            title: `${sanitize(company.name)} - Avaliações e opiniões`,
            description: sanitize(
              company.description ||
                `Veja avaliações e comentários sobre ${company.name} na Serel.`
            ),
            image: logo,
            url: `${baseUrl}${pathname}`,
            type: 'article',
          };
        }
      }
    }
    // Review details page
    else if (parts[0] === 'overview' && parts[1] === 'review' && parts[2] === 'details' && parts.length === 4) {
      const reviewId = parts[3];
      if (reviewId) {
        const { data: review } = await axios.post(
          'https://serel-backend.onrender.com/api/review/getOne',
          { filter: { id: reviewId } },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (review && review.id) {
          const { data: company } = await axios.post(
            'https://serel-backend.onrender.com/api/company/getOne',
            { filter: { id: review.companyId } },
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (company && company.id) {
            const reviewTitle = sanitize(review.reviewTitle || 'Avaliação');
            const companyName = sanitize(company.name || 'Empresa');
            const comment = sanitize(
              review.comment?.comment ||
                `Avaliação da empresa ${companyName} com ${review.score}/5 estrelas.`
            );
            let imageUrl =
              company.logo ||
              `${baseUrl}/banner_serel.jpg`; // Fallback to banner if no logo
            if (!imageUrl.startsWith('http')) {
              imageUrl = `${baseUrl}${imageUrl}`;
            }
            metaData = {
              title: `Avaliação - ${reviewTitle} na empresa ${companyName}`,
              description: comment.substring(0, 155),
              image: imageUrl,
              url: `${baseUrl}${pathname}`,
              type: 'article',
              publishedTime: review.createdAt || null,
              author: sanitize(review.jobTitle || 'Anônimo'),
            };
          }
        }
      }
    }
    // About page
    else if (parts[0] === 'about') {
      metaData = {
        title: 'Sobre a Serel',
        description:
          'Saiba mais sobre a missão da Serel e como ajudamos as pessoas a compartilharem suas experiências.',
        image: `${baseUrl}/banner_serel.jpg`,
        url: `${baseUrl}${pathname}`,
        type: 'website',
      };
    }
    // Contact page
    else if (parts[0] === 'contact') {
      metaData = {
        title: 'Contato - Serel',
        description:
          'Entre em contato com a equipe da Serel para suporte ou perguntas.',
        image: `${baseUrl}/banner_serel.jpg`,
        url: `${baseUrl}${pathname}`,
        type: 'website',
      };
    }
    // Fallback for other pages
    else {
      metaData = {
        title: 'Serel - Compartilhe as suas experiências',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: `${baseUrl}/banner_serel.jpg`,
        url: `${baseUrl}${pathname}`,
        type: 'website',
      };
    }
  } catch (err) {
    console.error('Erro ao gerar metadados:', err.message);
    // Use default metadata with banner image
    metaData.image = `${baseUrl}/banner_serel.jpg`;
  }

  const metaTags = generateMetaTags(metaData);
  html = html
    .replace(/<title>.*?</title>/i, `<title>${metaData.title}</title>`)
    .replace(
      /<meta name="description" content=".*?">/i,
      `<meta name="description" content="${metaData.description}">`
    )
    .replace(/<!-- SSR_META_TAGS -->/, metaTags);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.status(200).end(html);
};
