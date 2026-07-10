# 🌅 ReBorn – Reset. Rebuild. Rise.

A modern, mobile-first personal life reset and self-improvement platform for young adults (18–25), built with the **Sunrise Design System**.

## ✨ Features

- **Splash & Auth** – Animated splash screen, login & signup with Google OAuth placeholder
- **Blueprint Onboarding** – 3-step guided setup: goals → challenges → daily commitment
- **Dashboard** – XP bar, streak counter, weekly activity chart, mission scroll, daily quote
- **Missions** – Daily challenges with XP rewards, filterable by category
- **Study Hub** – Live Pomodoro timer (25/5 focus-break cycle) with SVG ring progress, subject tracking
- **Health & Wellness** – SVG activity rings (steps/sleep/active), water intake tracker, habit checklist
- **Journal** – Mood picker, writing prompts, entry history with tags
- **Profile** – Level system, achievements grid, settings panel with notification toggle

## 🎨 Design System (Sunrise)

| Token | Color | Use |
|-------|-------|-----|
| Primary | `#A78BFA` | Lavender – CTA, active states |
| Secondary | `#CFE8FF` | Sky Mist – backgrounds, accents |
| Background | `#FAFAF8` | Warm White – page base |
| Accent | `#FDBA74` | Golden Sunrise – highlights, badges |
| Health | `#BEEFD8` | Soft Mint – wellness elements |

**Typography:** Plus Jakarta Sans + Fraunces (serif headings)  
**Style:** Glassmorphism, smooth gradients, floating orbs, spring micro-animations

## 📁 Project Structure

```
ReBorn/
├── index.html              ← Single-page app (all 9 pages)
├── styles/
│   ├── design-system.css   ← CSS tokens, utilities, base reset
│   ├── components.css      ← Reusable component library
│   └── pages.css           ← Page-specific layouts & styles
└── js/
    └── app.js              ← Router, state management, interactions
```

## 🚀 Getting Started

Just open `index.html` in any modern browser — no build step required.

Or serve locally:

```bash
npx serve . -p 3000
```

Then visit `http://localhost:3000`.

## 🛣️ Roadmap

- [ ] Backend API integration (Node.js / Supabase)
- [ ] Real authentication (Firebase / Auth.js)
- [ ] Push notifications & reminders
- [ ] Dark mode theme
- [ ] Offline PWA support
- [ ] Social features – share streaks & achievements

## 📄 License

MIT © 2026 ReBorn
