const axios = require('axios');

module.exports = async (req, res) => {
    const { user = 'Artleboss2', bg_color = '0d1117', fire_color = 'ff9416' } = req.query;

    const token = process.env.GH_TOKEN;

    if (!token) {
        return res.status(500).send("Erreur : GH_TOKEN non configuré sur Vercel");
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
        const days = calendar.weeks.flatMap(w => w.contributionDays); 
        
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        days.forEach(day => {
            if (day.contributionCount > 0) {
                tempStreak++;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
        });
        const lastDays = [...days].reverse();
        for (let d of lastDays) {
            if (d.contributionCount > 0) currentStreak++;
            else if (currentStreak > 0) break;
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        .stat { font: 800 28px 'Segoe UI', Ubuntu, Sans-Serif; text-anchor: middle; fill: #fff; }
        .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; text-anchor: middle; fill: #8b949e; }
        .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #58a6ff; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
    </style>

    <rect x="0.5" y="0.5" width="494" height="194" rx="10" fill="#${bg_color}" stroke="#30363d"/>
    <text x="25" y="35" class="title">${user}'s Real Stats</text>

    <g transform="translate(80, 120)" class="animate" style="animation-delay: 100ms">
        <text x="0" y="0" class="stat">${calendar.totalContributions}</text>
        <text x="0" y="25" class="label">Total</text>
    </g>

    <g transform="translate(247, 120)" class="animate" style="animation-delay: 300ms">
        <path d="M0 -40 C0 -40 0 -25 -5 -20 C-10 -15 -15 -12 -15 -5 C-15 3 -8 10 0 10 C8 10 15 3 15 -5 C15 -15 5 -40 0 -40Z" fill="#${fire_color}"/>
        <text x="0" y="0" class="stat" fill="#${fire_color}">${currentStreak}</text>
        <text x="0" y="25" class="label">Current Streak</text>
    </g>

    <g transform="translate(415, 120)" class="animate" style="animation-delay: 500ms">
        <text x="0" y="0" class="stat">${longestStreak}</text>
        <text x="0" y="25" class="label">Longest</text>
    </g>
</svg>`);

    } catch (e) {
        res.status(500).send("Erreur API GitHub");
    }
};
