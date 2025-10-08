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

  const imageType = image && image.toLowerCase().endsWith('.jpg') || image.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' : 'image/png'

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

  let metaData = {
    title: 'Serel - Compartilhe as suas experiências',
    description:
      'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
    image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
    url: `https://serel-frontend-delta.vercel.app${url}`,
    type: 'website',
  }

  try {
    const pathname = new URL(`https://serel-frontend-delta.vercel.app${url}`).pathname
    const parts = pathname.split('/').filter(Boolean)
    
    
    console.log(parts);
    console.log(pathname);

    /** 🏠 Página inicial */
    if (parts[0] === '/') {
      metaData = {
        title: 'Serel - Compartilhe as suas experiências',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: 'https://serel-frontend-delta.vercel.app/',
        type: 'website',
      }
    }

    /** 🏢 Página da empresa */
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
              : `https://serel-frontend-delta.vercel.app${company.logo}`

          metaData = {
            title: `${sanitize(company.name)} - Avaliações e opiniões`,
            description: sanitize(
              company.description ||
                `Veja avaliações e comentários sobre ${company.name} na Serel.`
            ),
            image: logo,
            url: `https://serel-frontend-delta.vercel.app${url}`,
            type: 'article',
          }
        }
      }
    }
    /** 📝 Página de detalhes de review */
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

            let imageUrl =
              company.logo ||
              'https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png'
            if (!imageUrl.startsWith('http')) {
              imageUrl = `https://serel-frontend-delta.vercel.app${imageUrl}`
            }

            metaData = {
              title: `Avaliação - ${reviewTitle} na empresa ${companyName}`,
              description: comment.substring(0, 155),
              image: imageUrl,
              url: `https://serel-frontend-delta.vercel.app${url}`,
              type: 'article',
              publishedTime: review.createdAt || null,
              author: sanitize(review.jobTitle || 'Anônimo'),
            }
          }
        }
      }
    }

    /** ℹ️ Página sobre */
    else if (parts[0] === 'about') {
      metaData = {
        title: 'Sobre a Serel',
        description:
          'Saiba mais sobre a missão da Serel e como ajudamos as pessoas a compartilharem suas experiências.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 📞 Página de contato */
    else if (parts[0] === 'contact') {
      metaData = {
        title: 'Contato - Serel',
        description:
          'Entre em contato com a equipe da Serel para suporte ou perguntas.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** ❓ Página FAQ */
    else if (parts[0] === 'faq') {
      metaData = {
        title: 'FAQ - Serel',
        description: 'Perguntas frequentes sobre a plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🔍 Página de filtro */
    else if (parts[0] === 'filter') {
      metaData = {
        title: 'Filtrar Empresas - Serel',
        description: 'Encontre e filtre empresas na plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🔐 Página de login */
    else if (parts[0] === 'login') {
      metaData = {
        title: 'Login - Serel',
        description: 'Faça login na sua conta Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 📝 Página de registro */
    else if (parts[0] === 'signup') {
      metaData = {
        title: 'Registrar - Serel',
        description: 'Crie sua conta na plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🔑 Página de esqueci senha */
    else if (parts[0] === 'forgot-password') {
      metaData = {
        title: 'Esqueci a Senha - Serel',
        description: 'Recupere sua senha na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** ✅ Página de confirmar conta */
    else if (parts[0] === 'confirm-account') {
      metaData = {
        title: 'Confirmar Conta - Serel',
        description: 'Confirme sua conta na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🔄 Página de redefinir senha */
    else if (parts[0] === 'reset-password') {
      metaData = {
        title: 'Redefinir Senha - Serel',
        description: 'Redefina sua senha na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 📊 Dashboard */
    else if (parts[0] === 'dashboard' && parts.length === 1) {
      metaData = {
        title: 'Dashboard - Serel',
        description: 'Seu painel de controle na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 👤 Dashboard do usuário */
    else if (parts[0] === 'user' && parts[1] === 'dashboard') {
      metaData = {
        title: 'Dashboard do Usuário - Serel',
        description: 'Gerencie suas avaliações e perfil na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 📝 Detalhes da avaliação no dashboard */
    else if (parts[0] === 'dashboard' && parts[1] === 'review') {
      metaData = {
        title: 'Detalhes da Avaliação - Dashboard',
        description: 'Veja detalhes da avaliação no seu dashboard.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🏢 Avaliações da empresa */
    else if (parts[0] === 'reviews' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') ? company.logo : `https://serel-frontend-delta.vercel.app${company.logo}`
          metaData = {
            title: `${sanitize(company.name)} - Avaliações`,
            description: sanitize(company.description || `Veja avaliações da empresa ${company.name} na Serel.`),
            image: logo,
            url: `https://serel-frontend-delta.vercel.app${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para reviews:', err.message)
      }
    }

    /** 💰 Salários da empresa */
    else if (parts[0] === 'salaries' && parts[1] === 'company' && parts.length === 3) {
      const companyId = parts[2]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') ? company.logo : `https://serel-frontend-delta.vercel.app${company.logo}`
          metaData = {
            title: `${sanitize(company.name)} - Salários`,
            description: sanitize(company.description || `Veja salários na empresa ${company.name} na Serel.`),
            image: logo,
            url: `https://serel-frontend-delta.vercel.app${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para salaries:', err.message)
      }
    }

    /** ✍️ Formulário de avaliação da empresa */
    else if (parts[0] === 'company' && parts[2] === 'review' && parts.length === 3) {
      const companyId = parts[1]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') ? company.logo : `https://serel-frontend-delta.vercel.app${company.logo}`
          metaData = {
            title: `Avaliar ${sanitize(company.name)} - Serel`,
            description: sanitize(`Deixe sua avaliação para a empresa ${company.name}.`),
            image: logo,
            url: `https://serel-frontend-delta.vercel.app${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para review form:', err.message)
      }
    }

    /** 💵 Formulário de salário da empresa */
    else if (parts[0] === 'company' && parts[2] === 'salary' && parts.length === 3) {
      const companyId = parts[1]
      try {
        const { data: company } = await axios.post(
          'https://serel-backend.onrender.com/api/company/getOne',
          { filter: { id: companyId } },
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (company && company.id) {
          const logo = company.logo && company.logo.startsWith('http') ? company.logo : `https://serel-frontend-delta.vercel.app${company.logo}`
          metaData = {
            title: `Adicionar Salário - ${sanitize(company.name)}`,
            description: sanitize(`Adicione informações de salário para a empresa ${company.name}.`),
            image: logo,
            url: `https://serel-frontend-delta.vercel.app${url}`,
            type: 'article',
          }
        }
      } catch (err) {
        console.error('Erro ao buscar empresa para salary form:', err.message)
      }
    }

    /** ➕ Adicionar empresa */
    else if (parts[0] === 'add' && parts[1] === 'company') {
      metaData = {
        title: 'Adicionar Empresa - Serel',
        description: 'Adicione uma nova empresa à plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🏗️ Criar empresa */
    else if (parts[0] === 'company' && parts[1] === 'create') {
      metaData = {
        title: 'Criar Empresa - Serel',
        description: 'Crie uma nova empresa na plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 🔍 Filtrar salários de empresas */
    else if (parts[0] === 'companies' && parts[1] === 'salaries' && parts[2] === 'filter') {
      metaData = {
        title: 'Filtrar Salários de Empresas - Serel',
        description: 'Explore e filtre salários em diferentes empresas.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 📝 Avaliação geral */
    else if (parts[0] === 'company' && parts[1] === 'review') {
      metaData = {
        title: 'Avaliação Geral - Serel',
        description: 'Deixe uma avaliação geral na plataforma Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** 👁️ Visão geral da avaliação */
    else if (parts[0] === 'overview' && parts[1] === 'review' && parts.length === 3) {
      metaData = {
        title: 'Visão Geral da Avaliação - Serel',
        description: 'Veja a visão geral de uma avaliação na Serel.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'article',
      }
    }

    /** 🚫 Não autorizado */
    else if (parts[0] === 'not-authorized') {
      metaData = {
        title: 'Não Autorizado - Serel',
        description: 'Você não tem permissão para acessar esta página.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }

    /** ⏰ Token expirado */
    else if (parts[0] === 'expired-token') {
      metaData = {
        title: 'Token Expirado - Serel',
        description: 'Seu token de autenticação expirou. Faça login novamente.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }
    }else{
      // Mantém os metadados padrão já definidos no início 
      metaData = {
        title: 'Serel - Compartilhe as suas experiências',
        description:
          'Serel é uma plataforma onde você pode compartilhar suas experiências e inspirar outras pessoas.',
        image: 'https://serel-frontend-delta.vercel.app/banner_serel.jpg',
        url: `https://serel-frontend-delta.vercel.app${url}`,
        type: 'website',
      }      
    }

    /** 🌐 Outras páginas (fallback) */
    // O else foi removido pois o metaData padrão já está definido no início

  } catch (err) {
    console.error('Erro ao gerar metadados:', err.message)
    // Em caso de erro, mantém os metadados padrão já definidos
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
