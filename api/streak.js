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
    <rect width="495" height="195" rx="10" fill="#${bg_color}"/>
    <rect x="0.5" y="0.5" width="494" height="194" rx="10" stroke="#30363d" fill="none"/>
    
    <text x="25" y="35" fill="#58a6ff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="18">
        ${user}'s Real Stats
    </text>

    <g transform="translate(124, 120)">
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">${calendar.totalContributions}</text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">Total Contributions</text>
    </g>

    <g transform="translate(371, 120)">
        <g transform="translate(0, -52)">
            <path d="M8.213 18.257c.18 3.518-2.316 6.643-5.743 7.502-3.522.883-7.14-1.284-8.083-4.832-.832-3.125.748-6.386 3.73-7.669 3.016-1.295 4.315-4.52 3.102-7.464-.32-.776-.143-1.666.44-2.253.585-.587 1.474-.764 2.251-.444C8.421 5.042 12 9.548 12 14.331c0 1.332-.234 2.65-.688 3.882-.047.13-.102.26-.164.387-.197.41-.442.802-.735 1.157a8.557 8.557 0 01-2.2 1.5z" fill="#${fire_color}"/>
        </g>
        
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28">${currentStreak}</text>
        <text x="0" y="25" text-anchor="middle" fill="#8b949e" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="400" font-size="14">Current Streak</text>
    </g>

    <line x1="247.5" y1="80" x2="247.5" y2="150" stroke="#30363d" stroke-width="1"/>
</svg>`);
    } catch (e) {
        res.status(500).send("GitHub Error");
    }
};
    } catch (e) {
        res.status(500).send("GitHub Error");
    }
};
