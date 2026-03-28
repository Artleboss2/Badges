# My Custom Shields and Stats Service

Service de génération de badges et de cartes de statistiques pour profils GitHub, hébergé sur Vercel. Ce projet utilise l'API GraphQL de GitHub pour fournir des données précises en temps réel.

## Utilisation

Remplacez les paramètres dans les URL ci-dessous pour personnaliser vos badges.

### 1. Badges de dépôts (Style Shields.io)
Affiche le nombre de dépôts publics d'un utilisateur GitHub.

**URL de base :** `https://artleboss2-badges.vercel.app/api`

| Style | Aperçu | Syntaxe Markdown |
| :--- | :--- | :--- |
| **Flat (Défaut)** | ![Flat](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=flat) | `![Badge](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=flat)` |
| **Flat-Square** | ![Square](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=flat-square&color=4c1) | `![Badge](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=flat-square&color=4c1)` |
| **For-the-badge** | ![For-the-badge](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=for-the-badge&color=e05d44) | `![Badge](https://artleboss2-badges.vercel.app/api?user=Artleboss2&style=for-the-badge&color=e05d44)` |

---

### 2. Carte de Streak (Statistiques réelles)
Affiche les contributions totales, le streak actuel et le record historique avec animations CSS intégrées.

**URL de base :** `https://artleboss2-badges.vercel.app/api/streak`

#### Exemple d'intégration pour profil GitHub :
```markdown
<img src="[https://artleboss2-badges.vercel.app/api/streak?user=Artleboss2&bg_color=0d1117&fire_color=ff9416](https://artleboss2-badges.vercel.app/api/streak?user=Artleboss2&bg_color=0d1117&fire_color=ff9416)" alt="GitHub Streak" />
