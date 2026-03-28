import os

def create_badge(label, message, color, filename):
    # On remonte d'un niveau pour sortir de .github/scripts et aller dans /badges
    base_dir = os.path.join(os.path.dirname(__file__), "../../badges")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    
    label_len = len(label) * 7 + 12
    msg_len = len(message) * 7 + 12
    total_width = label_len + msg_len
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{total_width}" height="20">
      <rect width="{label_len}" height="20" fill="#555"/>
      <rect x="{label_len}" width="{msg_len}" height="20" fill="{color}"/>
      <g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
        <text x="{label_len/2}" y="14" text-anchor="middle">{label}</text>
        <text x="{label_len + msg_len/2}" y="14" text-anchor="middle">{message}</text>
      </g>
    </svg>"""
    
    with open(os.path.join(base_dir, f"{filename}.svg"), "w") as f:
        f.write(svg)

if __name__ == "__main__":
    create_badge("Build", "Passing", "#4c1", "build")
