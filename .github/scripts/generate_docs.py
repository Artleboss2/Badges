import os

ICON_DIR = "icons"
DOC_FILE = "DOCUMENTATION.md"
REPO_URL = os.getenv("GITHUB_REPOSITORY")

def generate_markdown():
    if not REPO_URL:
        print("Erreur : GITHUB_REPOSITORY n'est pas défini.")
        return

    header = f"# 🎨 Ma Bibliothèque de Badges\n\n"
    header += "| Aperçu | Code Markdown | Lien Brut (Raw) |\n"
    header += "| :---: | :--- | :--- |\n"

    lines = []
    
    if os.path.exists(ICON_DIR):
        files = sorted(os.listdir(ICON_DIR))
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                raw_url = f"https://raw.githubusercontent.com/{REPO_URL}/main/{ICON_DIR}/{filename}"

                preview = f"<img src='{raw_url}' height='30'>"
                markdown_code = f"`![{filename}]({raw_url})`"
                raw_link = f"[Lien Direct]({raw_url})"
                
                lines.append(f"| {preview} | {markdown_code} | {raw_link} |")

    with open(DOC_FILE, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(lines))
    
    print(f"✅ {DOC_FILE} mis à jour avec {len(lines)} icônes.")

if __name__ == "__main__":
    generate_markdown()
