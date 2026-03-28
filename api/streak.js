const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', bg_color = '0d1117', fire_color = 'ff9416' } = req.query;
    const token = process.env.GH_TOKEN;

    if (!token) {
        return res.status(500).send("Missing GH_TOKEN in Environment Variables");
    }

    const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables: { login: user } },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const calendar = response.data.data.user.contributionsCollection.contributionCalendar;
        const days = calendar.weeks.flatMap(w => w.contributionDays).reverse();
        
        // Calcul du Current Streak
        let currentStreak = 0;
        for (let day of days) {
            if (day.contributionCount > 0) {
                currentStreak++;
            } else if (currentStreak > 0) {
                break; // On s'arrête dès qu'on trouve un jour vide
            }
        }

        const total = calendar.totalContributions;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        .stat { font: 800 28px 'Segoe UI', Ubuntu, Sans-Serif; text-anchor: middle; }
        .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; text-anchor: middle; fill: #8b949e; }
        .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #58a6ff; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
    </style>

    <rect x="0.5" y="0.5" width="494" height="194" rx="10" fill="#${bg_color}" stroke="#30363d"/>
    <text x="25" y="35" class="title">${user}'s Real Stats</text>

    <g transform="translate(247, 70)">
        <path class="animate" d="M12 2C12 2 12 6 10 8C8 10 5 11 5 14C5 17.866 8.134 21 12 21C15.866 21 19 17.866 19 14C19 10 15 2 12 2Z" fill="#${fire_color}"/>
    </g>

    <g transform="translate(120, 130)" class="animate" style="animation-delay: 100ms">
        <text x="0" y="0" class="stat" fill="#fff">${total}</text>
        <text x="0" y="25" class="label">Total Contributions</text>
    </g>

    <g transform="translate(370, 130)" class="animate" style="animation-delay: 300ms">
        <text x="0" y="0" class="stat" fill="#${fire_color}">${currentStreak}</text>
        <text x="0" y="25" class="label">Current Streak</text>
    </g>

    <line x1="247" y1="110" x2="247" y2="160" stroke="#30363d" />
</svg>`);

    } catch (e) {
        res.status(500).send("GitHub API Error");
    }
};
