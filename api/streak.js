const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', bg_color = '0d1117', fire_color = 'ff9416' } = req.query;
    const token = process.env.GH_TOKEN;

    if (!token) return res.status(500).send("Missing GH_TOKEN");

    const query = `query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount } }
          }
        }
      }
    }`;

    try {
        const response = await axios.post('https://api.github.com/graphql', 
            { query, variables: { login: user } },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const calendar = response.data.data.user.contributionsCollection.contributionCalendar;
        const days = calendar.weeks.flatMap(w => w.contributionDays).reverse();
        
        let currentStreak = 0;
        for (let d of days) {
            if (d.contributionCount > 0) currentStreak++;
            else if (currentStreak > 0) break;
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        res.send(`
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="495" height="195" rx="10" fill="#${bg_color}" />
    <rect x="0.5" y="0.5" width="494" height="194" rx="10" stroke="#30363d" fill="none" />
    
    <text x="25" y="35" fill="#58a6ff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="18">
        ${user}'s Real Stats
    </text>

    <g transform="translate(124, 120)">
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">
            ${calendar.totalContributions}
        </text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">
            Total Contributions
        </text>
    </g>

    <g transform="translate(371, 120)">
        <text x="0" y="0" text-anchor="middle" fill="#${fire_color}" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">
            ${currentStreak}
        </text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">
            Current Streak
        </text>
        <path d="M-8 -55 C-8 -55 -8 -40 -13 -35 C-18 -30 -23 -27 -23 -20 C-23 -12 -16 -5 -8 -5 C0 -5 7 -12 7 -20 C7 -30 -3 -55 -8 -55" fill="#${fire_color}" transform="translate(0, -10) scale(0.8)"/>
    </g>

    <line x1="247.5" y1="80" x2="247.5" y2="150" stroke="#30363d" stroke-width="1"/>
</svg>`);
    } catch (e) {
        res.status(500).send("GitHub Error");
    }
};
