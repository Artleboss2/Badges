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
        res.send(`
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: #58a6ff; }
        .stat { font: 800 28px 'Segoe UI', Ubuntu, sans-serif; text-anchor: middle; fill: #ffffff; }
        .label { font: 400 14px 'Segoe UI', Ubuntu, sans-serif; text-anchor: middle; fill: #8b949e; }
        .fire { font: 800 28px 'Segoe UI', Ubuntu, sans-serif; text-anchor: middle; fill: #${fire_color}; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
    </style>

    <rect x="0.5" y="0.5" width="494" height="194" rx="10" fill="#${bg_color}" stroke="#30363d"/>
    
    <text x="25" y="35" class="title">${user}'s Real Stats</text>

    <g transform="translate(124, 110)" class="animate" style="animation-delay: 100ms">
        <text x="0" y="0" class="stat">${calendar.totalContributions}</text>
        <text x="0" y="25" class="label">Total Contributions</text>
    </g>

    <g transform="translate(371, 110)" class="animate" style="animation-delay: 300ms">
        <text x="0" y="0" class="fire">${currentStreak}</text>
        <text x="0" y="25" class="label">Current Streak</text>
        <path d="M-8 -55 C-8 -55 -8 -40 -13 -35 C-18 -30 -23 -27 -23 -20 C-23 -12 -16 -5 -8 -5 C0 -5 7 -12 7 -20 C7 -30 -3 -55 -8 -55" fill="#${fire_color}" transform="translate(8, 10)"/>
    </g>

    <line x1="247.5" y1="80" x2="247.5" y2="150" stroke="#30363d" stroke-width="1"/>
</svg>`);
    } catch (e) {
        res.status(500).send("GitHub Error");
    }
};
