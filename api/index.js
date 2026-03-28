const axios = require('axios');

module.exports = async (req, res) => {
    let { 
        user = 'Artleboss2', 
        style = 'flat', 
        label = 'repos', 
        color = '007ec6' 
    } = req.query;

    try {
        const response = await axios.get(`https://api.github.com/users/${user}`);
        let message = String(response.data.public_repos || 0);

        let r_val = "3";
        let h_val = "20";
        let font_size = "11";
        let y_text = "14";
        let y_shadow = "15";

        if (style === "flat-square") {
            r_val = "0";
        } else if (style === "for-the-badge") {
            r_val = "0";
            h_val = "28";
            font_size = "10";
            y_text = "18";
            y_shadow = "19";
            label = label.toUpperCase();
            message = message.toUpperCase();
        }

        const charWidth = (style === "for-the-badge") ? 8 : 7;
        const lWidth = label.length * charWidth + 12;
        const mWidth = message.length * charWidth + 12;
        const tWidth = lWidth + mWidth;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        res.send(`
<svg xmlns="http://www.w3.org/2000/svg" width="${tWidth}" height="${h_val}">
  <linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="a"><rect width="${tWidth}" height="${h_val}" rx="${r_val}" fill="#fff"/></clipPath>
  <g clip-path="url(#a)">
    <rect width="${lWidth}" height="${h_val}" fill="#555"/>
    <rect x="${lWidth}" width="${mWidth}" height="${h_val}" fill="#${color.replace('#', '')}"/>
    <rect width="${tWidth}" height="${h_val}" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-weight="bold" font-size="${font_size}">
    <text x="${lWidth/2}" y="${y_shadow}" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${lWidth/2}" y="${y_text}">${label}</text>
    <text x="${lWidth + mWidth/2}" y="${y_shadow}" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${lWidth + mWidth/2}" y="${y_text}">${message}</text>
  </g>
</svg>`);

    } catch (error) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="20"><rect width="80" height="20" fill="#e05d44"/><text x="40" y="14" fill="#fff" text-anchor="middle" font-family="Verdana" font-size="11">user not found</text></svg>`);
    }
};
