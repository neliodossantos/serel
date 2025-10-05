const { render } = require('../dist/server/entry-server.js')

module.exports = async (req, res) => {
  const url = req.url
  const html = await render(url)
  res.end(html)
}