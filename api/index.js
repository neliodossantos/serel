// api/ssr.js (ou server.js para Vercel)
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar o template HTML
let template
try {
  template = fs.readFileSync(
    path.join(__dirname, '../dist/index.html'),
    'utf-8'
  )
} catch (e) {
  // Fallback para desenvolvimento
  template = fs.readFileSync(
    path.join(__dirname, '../index.html'),
    'utf-8'
  )
}

// Função para sanitizar texto
const sanitize = (text) => {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Função para gerar meta tags
const generateMetaTags = (data) => {
  const {
    title = 'Serel - Compartilhe as suas experiências',
    description = 'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
    image = 'https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png',
    url = 'https://serel-frontend-delta.vercel.app',
    type = 'website',
    publishedTime = null,
    author = null
  } = data

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
  `
}

export default async (req, res) => {
  const url = req.url || req.path || '/'
  let html = template

  // Dados padrão
  let metaData = {
    title: 'Serel - Compartilhe as suas experiências',
    description: 'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
    image: 'https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png',
    url: `https://serel-frontend-delta.vercel.app${url}`,
    type: 'website'
  }

  // Se for página de review
  if (url.startsWith('/overview/review/details/')) {
    const reviewId = url.split('/').filter(Boolean)[3] // overview/review/details/ID
    
    if (reviewId) {
      try {
        console.log('Fetching review:', reviewId)
        
        // Buscar review
        const reviewResponse = await axios.post(
          'https://serel-backend.onrender.com/api/review/getOne',
          {
            filter: { id: reviewId },
            page: 1,
            limit: 1
          },
          {
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
          }
        )
        
        const review = reviewResponse.data

        if (review && review.id) {
          // Buscar empresa
          const companyResponse = await axios.post(
            'https://serel-backend.onrender.com/api/company/getOne',
            {
              filter: { id: review.companyId },
              page: 1,
              limit: 1
            },
            {
              timeout: 5000,
              headers: { 'Content-Type': 'application/json' }
            }
          )
          
          const company = companyResponse.data

          if (company && company.id) {
            // Sanitizar dados
            const reviewTitle = sanitize(review.reviewTitle || 'Avaliação')
            const companyName = sanitize(company.name || 'Empresa')
            const comment = sanitize(
              review.comment?.comment || 
              `Avaliação da empresa ${companyName} com ${review.score}/5 estrelas.`
            )

            // Preparar imagem
            let imageUrl = company.logo || 'https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png'
            if (!imageUrl.startsWith('http')) {
              imageUrl = `https://serel-frontend-delta.vercel.app${imageUrl}`
            }

            // Atualizar metaData
            metaData = {
              title: `${reviewTitle} - Avaliação de ${companyName}`,
              description: comment.substring(0, 155),
              image: imageUrl,
              url: `https://serel-frontend-delta.vercel.app${url}`,
              type: 'article',
              publishedTime: review.createdAt || null,
              author: sanitize(review.jobTitle || 'Anônimo')
            }

            console.log('Meta data generated:', metaData.title)
          }
        }
      } catch (error) {
        console.error('Error fetching review data:', error.message)
        // Continua com dados padrão
      }
    }
  }

  // Gerar meta tags
  const metaTags = generateMetaTags(metaData)

  // Substituir no HTML
  // 1. Title
  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${metaData.title}</title>`
  )
  // 2. Description
  html = html.replace(
    /<meta name="description" content=".*?">/i,
    `<meta name="description" content="${metaData.description}">`
  )
  // 3. Inserir meta tags completas
  html = html.replace(
    /<!-- SSR_META_TAGS -->/,
    metaTags
  )
  // Headers HTTP
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  res.setHeader('X-Robots-Tag', 'index, follow')

  res.status(200).end(html)
}