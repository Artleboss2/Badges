const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', label = 'repos', color = '007ec6' } = req.query;

    try {
        const response = await axios.get(`https://api.github.com/users/${user}`);
        const message = String(response.data.public_repos || 0);

        const lWidth = label.length * 7 + 12;
        const mWidth = message.length * 7 + 12;
        const tWidth = lWidth + mWidth;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="a"><rect width="${tWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#a)">
    <rect width="${lWidth}" height="20" fill="#555"/>
    <rect x="${lWidth}" width="${mWidth}" height="20" fill="#${color}"/>
    <rect width="${tWidth}" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-weight="bold" font-size="11">
    <text x="${lWidth/2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${lWidth/2}" y="14">${label}</text>
    <text x="${lWidth + mWidth/2}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${lWidth + mWidth/2}" y="14">${message}</text>
  </g>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
        res.status(200).send(svg);

    } catch (error) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="20"><rect width="80" height="20" fill="#e05d44"/><text x="40" y="14" fill="#fff" text-anchor="middle" font-family="Verdana" font-size="11">error</text></svg>`);
    }
};
