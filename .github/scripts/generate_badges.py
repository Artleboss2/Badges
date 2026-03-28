import os
import json
import urllib.request

def create_badge(label, message, color, filename, style="flat"):
    base_dir = os.path.join(os.path.dirname(__file__), "../../badges")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    r_val, h_val, font_size, y_text, y_shadow = "3", "20", "11", "14", "15"
    
    if style == "flat-square":
        r_val = "0"
    elif style == "for-the-badge":
        r_val, h_val, font_size, y_text, y_shadow = "0", "28", "10", "18", "19"
        label, message = label.upper(), message.upper()

    l_width = len(label) * (8 if style == "for-the-badge" else 7) + 12
    m_width = len(message) * (8 if style == "for-the-badge" else 7) + 12
    t_width = l_width + m_width

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{t_width}" height="{h_val}">
  <linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="a"><rect width="{t_width}" height="{h_val}" rx="{r_val}" fill="#fff"/></clipPath>
  <g clip-path="url(#a)">
    <rect width="{l_width}" height="{h_val}" fill="#555"/>
    <rect x="{l_width}" width="{m_width}" height="{h_val}" fill="{color}"/>
    <rect width="{t_width}" height="{h_val}" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-weight="bold" font-size="{font_size}">
    <text x="{l_width/2}" y="{y_shadow}" fill="#010101" fill-opacity=".3">{label}</text>
    <text x="{l_width/2}" y="{y_text}">{label}</text>
    <text x="{l_width + m_width/2}" y="{y_shadow}" fill="#010101" fill-opacity=".3">{message}</text>
    <text x="{l_width + m_width/2}" y="{y_text}">{message}</text>
  </g>
</svg>"""

    name = f"{filename}_{style}" if style != "flat" else filename
    with open(os.path.join(base_dir, f"{name}.svg"), "w") as f:
        f.write(svg)

def get_github_data(username):
    url = f"https://api.github.com/users/{username}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())

if __name__ == "__main__":
    try:
        data = get_github_data("Artleboss2")
        repos = str(data.get("public_repos", 0))
        followers = str(data.get("followers", 0))
        
        # Generation des badges de test
        create_badge("repos", repos, "#007ec6", "github_repos", "flat")
        create_badge("followers", followers, "#4c1", "followers", "flat-square")
        create_badge("status", "online", "#e05d44", "status", "for-the-badge")
    except:
        create_badge("github", "error", "#999", "github_repos")
