const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', bg_color = '0d1117', fire_color = 'ff9416' } = req.query;
    const token = process.env.GH_TOKEN;

    if (!token) {
        return res.status(500).send("Missing GH_TOKEN on Vercel");
    }

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

        if (!response.data.data || !response.data.data.user) {
            throw new Error("User not found");
        }

        const calendar = response.data.data.user.contributionsCollection.contributionCalendar;
        const days = calendar.weeks.flatMap(w => w.contributionDays).reverse();
        
        let currentStreak = 0;
        for (let d of days) {
            if (d.contributionCount > 0) currentStreak++;
            else if (currentStreak > 0) break;
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        const svg = `
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="495" height="195" rx="10" fill="#${bg_color.replace('#','')}" />
    <rect x="0.5" y="0.5" width="494" height="194" rx="10" stroke="#30363d" fill="none" />
    
    <text x="25" y="35" fill="#58a6ff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="18">
        ${user}'s Real Stats
    </text>

    <g transform="translate(124, 120)">
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">${calendar.totalContributions}</text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">Total Contributions</text>
    </g>

    <g transform="translate(371, 120)">
        <path d="M-2 -50 C-2 -50 8 -40 8 -30 C8 -20 2 -15 2 -15 C2 -15 -4 -20 -4 -30 C-4 -40 -2 -50 -2 -50 Z" fill="#${fire_color.replace('#','')}" transform="scale(1.5) translate(-2, 5)" />
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">${currentStreak}</text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">Current Streak</text>
    </g>

    <line x1="247.5" y1="80" x2="247.5" y2="150" stroke="#30363d" stroke-width="1"/>
</svg>`;

        res.status(200).send(svg);

    } catch (e) {
        console.error(e);
        res.status(200).send(`<svg width="400" height="50"><text x="10" y="25" fill="red">Error: ${e.message}</text></svg>`);
    }
};
