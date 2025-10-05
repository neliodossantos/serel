import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8')

export default async (req, res) => {
  const url = req.url
  let html = indexHtml
  let metaTags = `
<meta property="og:type" content="website">
<meta property="og:title" content="Serel - Compartilhe as suas experiências">
<meta property="og:description" content="Compartilhe suas histórias e experiências com o mundo.">
<meta property="og:image" content="https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png">
<meta property="og:image:alt" content="Serel - Compartilhe as suas experiências">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://serel-frontend-delta.vercel.app">
<meta property="og:site_name" content="Serel">
`

  if (url.startsWith('/overview/review/details/')) {
    const reviewId = url.split('/')[4]
    try {
      const reviewResponse = await axios.post('https://serel-backend.onrender.com/api/review/getOne', {
        filter: { id: reviewId },
        page: 1,
        limit: 1
      })
      const review = reviewResponse.data

      const companyResponse = await axios.post('https://serel-backend.onrender.com/api/company/getOne', {
        filter: { id: review.companyId },
        page: 1,
        limit: 1
      })
      const company = companyResponse.data

      const title = `${review.reviewTitle} - Avaliação de ${company.name}`
      const description = (review.comment?.comment || `Avaliação da empresa ${company.name} com ${review.score}/5 estrelas.`).substring(0, 160)
      const image = company.logo || 'https://serel-frontend-delta.vercel.app/logo_alternativo_serel.png'

      metaTags = `
<meta property="og:title" content="${title.replace(/"/g, '"')}">
<meta property="og:description" content="${description.replace(/"/g, '"')}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="https://serel-frontend-delta.vercel.app${url}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title.replace(/"/g, '"')}">
<meta name="twitter:description" content="${description.replace(/"/g, '"')}">
<meta name="twitter:image" content="${image}">
`
    } catch (e) {
      console.error('Error fetching data for SSR:', e.message)
    }
  }

  html = html.replace('<!-- SSR_META_TAGS -->', metaTags)

  res.setHeader('Content-Type', 'text/html')
  res.end(html)
}