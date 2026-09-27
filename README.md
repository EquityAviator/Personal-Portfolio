# Muhammad Hamza Mushtaq — Personal Portfolio

> Software & AI Engineer · Attock, Pakistan
> I build AI-enabled software systems — from model experimentation and dataset engineering to production products people actually use.

A production-grade, single-page portfolio built with **Next.js 16**, featuring deep-linked case studies, an in-browser print-to-PDF resume, PWA support, and a fully content-driven architecture where every word on the page comes from typed content files.

**Live sections:** Hero → Proof strip → Selected Work → Process → Capabilities → Research → Education → About → Contact

---

## ✨ Features

### Content & Storytelling
- **Content-driven architecture** — all copy, projects, skills and profile data live in typed content files under `src/content/` (`site.ts`, `projects.ts`, `types.ts`). The UI is a pure renderer over this source of truth.
- **Honesty-first case studies** — four documented projects (Dark Pattern Hunter, CaptionAI, ChainProof, AngluPol). Every metric, capability and limitation comes from real project documentation — nothing is invented.
- **Deep-linked case study overlays** — each project opens as a full overlay at `#case-<slug>`, so any case study is directly linkable and shareable (e.g. `/#case-dark-pattern-hunter`).
- **Skill filter** — the Capabilities section supports interactive filtering by skill group.

### Engineering & UX
- **Print-to-PDF resume** — a dedicated print stylesheet transforms the page into a clean 2-page resume (10.5pt Geist, amber identity bar, controlled page breaks). Triggered from the header, mobile menu, footer and contact section. Accessible by design: the print surface is `aria-hidden` and invisible on screen.
- **Section permalinks** — hovering a section heading reveals an anchor button that copies a shareable URL to the clipboard (with fallback) plus a toast confirmation.
- **PWA-ready** — web app manifest (`standalone` display, themed icons), installable on desktop and mobile, with iOS web-app meta tags.
- **vCard download** — visitors can save contact details directly from the site.
- **Dark / light theme** — warm charcoal and paper palettes with a single amber accent, honoring system preference with manual toggle.
- **Polished interactions** — scroll progress bar, back-to-top, sticky blur header, mobile navigation, Motion-based section reveals, toast feedback on every actionable element.
- **Accessible** — semantic HTML landmarks, ARIA labels, keyboard navigability, descriptive alt text, 44px+ touch targets.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com), Radix primitives |
| Styling | Tailwind CSS 4, OKLCH design tokens |
| Icons | Lucide React |
| Animation | Motion |
| State | Zustand |
| Data | Prisma ORM + SQLite |
| Runtime | Bun / Node.js |

---

## 🚀 Getting Started

### Prerequisites
- **Bun** (recommended) or Node.js 20+
- Git

### Install & run

```bash
# clone
git clone https://github.com/EquityAviator/Personal-Portfolio.git
cd Personal-Portfolio

# install dependencies
bun install

# sync the database schema (Prisma + SQLite)
bun run db:push

# start the dev server → http://localhost:3000
bun run dev
```

### Other scripts

```bash
bun run lint        # ESLint (Next.js rules)
bun run build       # production build (standalone output)
bun run start       # serve the production build
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/                  # App Router: layout, page, manifest, global styles
│   ├── components/
│   │   ├── site/             # Portfolio sections & interactive islands
│   │   │   ├── hero.tsx            # Hero with availability & value proposition
│   │   │   ├── proof-strip.tsx     # Four-pillar proof strip
│   │   │   ├── selected-work.tsx   # Project grid + #case-<slug> overlays
│   │   │   ├── how-i-build.tsx     # Process narrative
│   │   │   ├── capabilities.tsx    # Skills with filtering
│   │   │   ├── research.tsx        # Research work
│   │   │   ├── education.tsx       # Education timeline
│   │   │   ├── about.tsx           # About section
│   │   │   ├── contact.tsx         # Contact & documents
│   │   │   ├── resume-print.tsx    # Print-to-PDF resume engine
│   │   │   ├── section-anchor.tsx  # Hover permalink buttons
│   │   │   └── site-header.tsx / site-footer.tsx
│   │   └── ui/               # shadcn/ui primitives
│   ├── content/              # ⭐ Single source of truth (typed)
│   │   ├── site.ts           # Profile, nav, education, skills, narrative
│   │   ├── projects.ts       # The four documented case studies
│   │   └── types.ts          # Shared content types
│   ├── hooks/                # Client hooks
│   └── lib/                  # Utilities & Prisma client
├── prisma/                   # Database schema
├── public/                   # Static assets (icon.svg, logo)
└── db/                       # SQLite runtime file (gitignored)
```

---

## ✏️ Editing Content

Everything visible on the site is editable in **`src/content/`** — no component changes required:

- **`site.ts`** — profile (name, role, contact, socials), navigation links, education, skill groups, proof strip, process steps.
- **`projects.ts`** — case studies: tagline, problem, story beats, metrics, status, timeline, role, tech. Each project carries a deliberate storytelling identity (e.g. *Observe · Detect · Ground · Verify*).
- **`types.ts`** — TypeScript contracts enforced at build time.

Adding a new project = adding one typed object; the card grid, deep-link overlay, skill filter and resume print surface all pick it up automatically.

---

## 🌐 Deployment

The site builds to a standalone Next.js server and deploys to any Node-capable host (Vercel, Fly.io, Railway, a VPS…):

```bash
bun run build
bun run start
```

The SQLite database is file-based and zero-config; swap the Prisma datasource to Postgres/MySQL for managed platforms. The print stylesheet and PWA manifest work out of the box with no extra hosting configuration.

---

## 📫 Contact

**Muhammad Hamza Mushtaq** — Software & AI Engineer
Open to Software & AI roles · 2026 graduate

- 📧 Email: [m.hamza.mushtaq.14@gmail.com](mailto:m.hamza.mushtaq.14@gmail.com)
- 📱 Phone: [+92 303 7370044](tel:+923037370044)
- 💻 GitHub: [@EquityAviator](https://github.com/EquityAviator)
- 💼 LinkedIn: [Muhammad Hamza Mushtaq](https://www.linkedin.com/in/muhammad-hamza-mushtaq-93b47428b)

---

© 2026 Muhammad Hamza Mushtaq. All rights reserved.
