import os
import json
import urllib.request

def create_badge(label, message, color, filename, style="flat"):
    base_dir = os.path.join(os.path.dirname(__file__), "../../badges")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    # Paramètres par défaut (Style Flat)
    r_val = "3"
    h_val = "20"
    font_size = "11"
    y_text = "14"
    y_shadow = "15"
    text_transform = lambda x: x

    # Adaptations selon le style
    if style == "flat-square":
        r_val = "0"
    elif style == "for-the-badge":
        r_val = "0"
        h_val = "28"
        font_size = "10"
        y_text = "18"
        y_shadow = "19"
        text_transform = lambda x: x.upper()
        label = text_transform(label)
        message = text_transform(message)

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

if __name__ == "__main__":
    create_badge("license", "MIT", "#44cc11", "license", style="flat")
    create_badge("license", "MIT", "#44cc11", "license", style="flat-square")
    create_badge("license", "MIT", "#44cc11", "license", style="for-the-badge")
