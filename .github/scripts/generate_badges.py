import os
import json
import urllib.request

def create_badge(label, message, color, filename):
    base_dir = os.path.join(os.path.dirname(__file__), "../../badges")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    
    l_width = len(label) * 7 + 12
    m_width = len(message) * 7 + 12
    t_width = l_width + m_width
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{t_width}" height="20">
  <linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="a"><rect width="{t_width}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#a)">
    <rect width="{l_width}" height="20" fill="#555"/>
    <rect x="{l_width}" width="{m_width}" height="20" fill="{color}"/>
    <rect width="{t_width}" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="{l_width/2}" y="15" fill="#010101" fill-opacity=".3">{label}</text>
    <text x="{l_width/2}" y="14">{label}</text>
    <text x="{l_width + m_width/2}" y="15" fill="#010101" fill-opacity=".3">{message}</text>
    <text x="{l_width + m_width/2}" y="14">{message}</text>
  </g>
</svg>"""
    
    with open(os.path.join(base_dir, f"{filename}.svg"), "w") as f:
        f.write(svg)

def get_data(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())

if __name__ == "__main__":
    create_badge("status", "up", "#4c1", "status")
    
    try:
        user = "octocat"
        data = get_data(f"https://api.github.com/users/{user}")
        create_badge("repos", str(data.get("public_repos", 0)), "#007ec6", "github_repos")
    except:
        create_badge("repos", "error", "#e05d44", "github_repos")
