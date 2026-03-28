const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', theme = 'dark', bg_color = '0a0a0a' } = req.query;

    try {
        const response = await axios.get(`https://api.github.com/users/${user}`);
        const publicRepos = response.data.public_repos;
        const followers = response.data.followers;

        const titleColor = "#fff";
        const textColor = "#888";

        res.setHeader('Content-Type', 'image/svg+xml');

        res.send(`
<svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="100" rx="10" fill="#${bg_color}"/>
    
    <g transform="translate(25, 25)">
        <text x="0" y="0" fill="${titleColor}" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="18">
            Public Repos
        </text>
        <text x="0" y="25" fill="${textColor}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="14">
            Total: ${publicRepos}
        </text>
    </g>

    <g transform="translate(225, 25)">
        <text x="0" y="0" fill="${titleColor}" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="18">
            Followers
        </text>
        <text x="0" y="25" fill="${textColor}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="14">
            Current: ${followers}
        </text>
    </g>

    <line x1="200" y1="20" x2="200" y2="80" stroke="${textColor}" stroke-opacity="0.2" />
</svg>`);

    } catch (e) {
        res.status(500).send('Error');
    }
};
