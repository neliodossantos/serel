import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let template
try {
  template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
} catch {
  template = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8')
}

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
    : ''

const generateMetaTags = (data) => {
  const {
    title,
    description,
    image,
    url,
    type,
    publishedTime = null,
    author = null,
  } = data

  const imageType = image && (image.toLowerCase().endsWith('.jpg') || image.toLowerCase().endsWith('.jpeg')) ? 'image/jpeg' : 'image/png'

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
    <meta property="og:image:type" content="${imageType}">
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
  const url = req.url || '/'
  let html = template

  const defaultBannerImage = 'https://www.serel.ao/banner_serel.jpg'
  const defaultLogoImage = 'https://www.serel.ao/logo_alternativo_serel.png'

  let metaData = {
    title: 'Serel - Compartilhe as suas experiências',
    description:
      'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
    image: defaultBannerImage,
    url: `https://www.serel.ao/${url}`,
    type: 'website',
  }

  try {
    const pathname = new URL(`https://www.serel.ao/${url}`).pathname
    const parts = pathname.split('/').filter(Boolean)
    
    if (parts.length === 0 || pathname === '/' || pathname === 'https://www.serel.ao/' || pathname === 'https://www.serel.ao') {
      metaData = {
        title: 'Serel - Página Inicial',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: defaultBannerImage,
        url: 'https://www.serel.ao/',
        type: 'website',
      }
    }
    else if (parts[0] === 'overview' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2]
      if (companyId) {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo =
            company.logo && company.logo.startsWith('http')
              ? company.logo
              : company.logo
              ? `https://www.serel.ao/${company.logo}`
              : defaultBannerImage

          metaData = {
            title: `${sanitize(company.name)} - Avaliações e opiniões`,
            description: sanitize(
              company.description ||
                `Veja avaliações e comentários sobre ${company.name} na Serel.`
            ),
            image: logo,
            url: `https://www.serel.ao/${url}`,
            type: 'article',
          }
        }
      }
    }
    else if (parts[0] === 'overview' && parts[1] === 'review' && parts[2] === 'details' && parts.length === 4) {
      const reviewId = parts[3]
      if (reviewId) {
        const { data: review } = await axios.post(
          'https://serel-backend.onrender.com/api/review/getOne',
          { filter: { id: reviewId } },
          { headers: { 'Content-Type': 'application/json' } }
        )

        if (review && review.id) {
          const { data: company } = await axios.post(
            'https://serel-backend.onrender.com/api/company/getOne',
            { filter: { id: review.companyId } },
            { headers: { 'Content-Type': 'application/json' } }
          )

          if (company && company.id) {
            const reviewTitle = sanitize(review.reviewTitle || 'Avaliação')
            const companyName = sanitize(company.name || 'Empresa')
            const comment = sanitize(
              review.comment?.comment ||
                `Avaliação da empresa ${companyName} com ${review.score}/5 estrelas.`
            )

            let imageUrl = company.logo || defaultLogoImage
            if (!imageUrl.startsWith('http')) {
              imageUrl = `https://www.serel.ao/${imageUrl}`
            }

            metaData = {
              title: `Avaliação - ${reviewTitle} na empresa ${companyName}`,
              description: comment.substring(0, 155),
              image: imageUrl,
              url: `https://www.serel.ao/${url}`,
              type: 'article',
              publishedTime: review.createdAt || null,
              author: sanitize(review.jobTitle || 'Anônimo'),
            }
          }
        }
      }
    }
    else if (parts[0] === 'about') {
      metaData = {
        title: 'Sobre a Serel',
        description:
          'Saiba mais sobre a missão da Serel e como ajudamos as pessoas a compartilharem suas experiências.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'contact') {
      metaData = {
        title: 'Contato - Serel',
        description:
          'Entre em contato com a equipe da Serel para suporte ou perguntas.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'faq') {
      metaData = {
        title: 'FAQ - Serel',
        description: 'Perguntas frequentes sobre a plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'filter') {
      metaData = {
        title: 'Filtrar Empresas - Serel',
        description: 'Encontre e filtre empresas na plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }

    /** 🔐 Página de login */
    else if (parts[0] === 'login') {
      metaData = {
        title: 'Login - Serel',
        description: 'Faça login na sua conta Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'signup') {
      metaData = {
        title: 'Registrar - Serel',
        description: 'Crie sua conta na plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'forgot-password') {
      metaData = {
        title: 'Esqueci a Senha - Serel',
        description: 'Recupere sua senha na Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'confirm-account') {
      metaData = {
        title: 'Confirmar Conta - Serel',
        description: 'Confirme sua conta na Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'reset-password') {
      metaData = {
        title: 'Redefinir Senha - Serel',
        description: 'Redefina sua senha na Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'reviews' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') 
            ? company.logo 
            : company.logo 
            ? `https://www.serel.ao/${company.logo}`
            : defaultBannerImage
          metaData = {
            title: `${sanitize(company.name)} - Avaliações`,
            description: sanitize(company.description || `Veja avaliações da empresa ${company.name} na Serel.`),
            image: logo,
            url: `https://www.serel.ao/${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para reviews:', err.message)
      }
    }
    else if (parts[0] === 'salaries' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') 
            ? company.logo 
            : company.logo 
            ? `https://www.serel.ao/${company.logo}`
            : defaultBannerImage
          metaData = {
            title: `${sanitize(company.name)} - Salários`,
            description: sanitize(company.description || `Veja salários na empresa ${company.name} na Serel.`),
            image: logo,
            url: `https://www.serel.ao/${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para salaries:', err.message)
      }
    }
    else if (parts[0] === 'company' && parts[2] === 'review' && parts.length === 3) {
      const companyId = parts[1]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') 
            ? company.logo 
            : company.logo 
            ? `https://www.serel.ao/${company.logo}`
            : defaultBannerImage
          metaData = {
            title: `Avaliar ${sanitize(company.name)} - Serel`,
            description: sanitize(`Deixe sua avaliação para a empresa ${company.name}.`),
            image: logo,
            url: `https://www.serel.ao/${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para review form:', err.message)
      }
    }
    else if (parts[0] === 'company' && parts[2] === 'salary' && parts.length === 3) {
      const companyId = parts[1]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') 
            ? company.logo 
            : company.logo 
            ? `https://www.serel.ao/${company.logo}`
            : defaultBannerImage
          metaData = {
            title: `Adicionar Salário - ${sanitize(company.name)}`,
            description: sanitize(`Adicione informações de salário para a empresa ${company.name}.`),
            image: logo,
            url: `https://www.serel.ao/${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para salary form:', err.message)
      }
    }
    else if (parts[0] === 'add' && parts[1] === 'company') {
      metaData = {
        title: 'Adicionar Empresa - Serel',
        description: 'Adicione uma nova empresa à plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'company' && parts[1] === 'create') {
      metaData = {
        title: 'Criar Empresa - Serel',
        description: 'Crie uma nova empresa na plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'companies' && parts[1] === 'salaries' && parts[2] === 'filter') {
      metaData = {
        title: 'Filtrar Salários de Empresas - Serel',
        description: 'Explore e filtre salários em diferentes empresas.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'company' && parts[1] === 'review') {
      metaData = {
        title: 'Avaliação Geral - Serel',
        description: 'Deixe uma avaliação geral na plataforma Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'overview' && parts[1] === 'review' && parts.length === 3) {
      metaData = {
        title: 'Visão Geral da Avaliação - Serel',
        description: 'Veja a visão geral de uma avaliação na Serel.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'article',
      }
    }
    else if (parts[0] === 'not-authorized') {
      metaData = {
        title: 'Não Autorizado - Serel',
        description: 'Você não tem permissão para acessar esta página.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else if (parts[0] === 'expired-token') {
      metaData = {
        title: 'Token Expirado - Serel',
        description: 'Seu token de autenticação expirou. Faça login novamente.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }
    }
    else {
      metaData = {
        title: 'Serel - Compartilhe as suas experiências',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: defaultBannerImage,
        url: `https://www.serel.ao/${url}`,
        type: 'website',
      }      
    }

  } catch (err) {
    console.error('Erro ao gerar metadados:', err.message)
  }

  const metaTags = generateMetaTags(metaData)
  html = html
    .replace(/<title>.*?<\/title>/i, `<title>${metaData.title}</title>`)
    .replace(
      /<meta name="description" content=".*?">/i,
      `<meta name="description" content="${metaData.description}">`
    )
    .replace(/<!-- SSR_META_TAGS -->/, metaTags)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  res.setHeader('X-Robots-Tag', 'index, follow')
  res.status(200).end(html)
}