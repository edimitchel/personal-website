# AGENTS.md — personal-website (Michel Edighoffer)

Consignes pour Grok CLI et tout agent travaillant dans ce dépôt. À respecter à chaque session.

## Projet

Site perso de Michel EDIGHOFFER (dev Nuxt/Vue freelance), domaine `https://micheledighoffer.fr`.
Refonte en cours : stack graphique en **Nuxt UI v4** (thème custom fidèle au rendu actuel), admin `/admin` maison avec **UEditor** (TipTap) pour éditer le Markdown/MDC de **Nuxt Content v3**, images éventuelles vers **R2**, hébergement **Cloudflare Workers**.

Le détail des étapes et les décisions (UnoCSS, UEditor, persistance) est dans `PLAN.md`.

## Stack actuelle (à connaître)

- Nuxt **4.4.8**, Vue **3.5**, Nitro **2.13.4**, preset **`cloudflare_module`**
- pnpm **10.28.0**, Node **>= 22** (`.nvmrc` = 22)
- @nuxt/content **3.14.0**, @nuxtjs/i18n **10.4.0** (FR défaut sans préfixe, EN sous `/en`)
- @nuxthub/core (bindings D1 `DB`, KV `KV`/`CACHE`, R2 `BLOB` déjà dans `wrangler.jsonc`)
- UnoCSS (presetWind4) **en cours de remplacement** par Nuxt UI + Tailwind CSS v4 — ne pas rajouter de dépendances UnoCSS
- Contenu : Markdown dans `content/pages|articles|projects` (FR dans `…/fr/`)
- CI existante : `.github/workflows/build-translate-deploy.yml` (build + `wrangler deploy` sur `main`, preview sur PR)

## Commandes

```bash
pnpm install          # obligatoire après clone / changement de lockfile
pnpm dev              # nuxi/nuxt dev, http://localhost:3000
pnpm build            # build Workers (cloudflare_module) + prerender
pnpm preview          # nuxt preview
pnpm wrangler dev     # ou : pnpm exec wrangler dev  — runtime Workers local
                      # copier .dev.vars.example vers .dev.vars (ne jamais le committer)
pnpm test:run
pnpm lint
pnpm typecheck
```

Ne pas inventer d’autres scripts de deploy. Le script `pnpm deploy` existant lance `wrangler deploy` : **ne pas l’exécuter**.

## Interdit

- **Pas de `wrangler deploy` en production** (worker `website`), ni `pnpm deploy`.
- **Pas de deploy preview** (`wrangler deploy --env preview` / `pnpm deploy:preview`) sauf demande explicite de Michel.
- **Pas de secrets** lus, affichés, commités ou créés dans Cloudflare (`wrangler secret put`, `.dev.vars`, `.env`, tokens GitHub/Cloudflare/Telegram/Mistral, `NUXT_OG_IMAGE_SECRET`).
- **Pas de DNS**, pas de changements de domaine, pas de dashboard Cloudflare, pas de création/suppression de D1/KV/R2.
- **Pas de push sur `main`**, pas de force-push, pas de modification de la CI de production sans demande.
- Ne pas ouvrir de PR tout seul sauf si Michel le demande.

## Branche

Travailler uniquement sur une branche dédiée, à partir de `main` à jour :

```bash
git checkout main
git pull
git checkout -b feat/nuxt-ui-admin
```

Si la branche existe déjà, s’y replacer et continuer dessus. Commits atomiques, messages en français ou en conventional commits clairs (`feat(ui): …`, `feat(admin): …`). Ne pas modifier des fichiers hors scope de l’étape en cours (voir `PLAN.md`).

## Conventions

- TypeScript, Composition API, auto-imports Nuxt. Pas de Comments inutiles.
- i18n : toute chaîne d’UI visible passe par `$t` / `i18n/locales/{fr,en}.json`. FR est la locale par défaut.
- Contenu public : uniquement via Nuxt Content (pas de texte métier en dur dans les composants, hors chrome déjà existant à migrer).
- Le rendu public doit rester visuellement fidèle (palette gray, typo Gabarito / Source Code Pro, colonne `max-w-[600px]`, dark mode). Ne pas « redesigner » sans demande.
- Pages de contenu aujourd’hui pré-rendues au build : ne pas casser le prerender tant que `PLAN.md` ne le demande pas.
- Admin : routes sous `/admin`, jamais indexées (`robots`). Auth prévue (Cloudflare Access et/ou session), ne pas laisser `/admin` public.
- Images nouvelles : R2 (`BLOB`), pas de commit de binaires lourds dans git.
- Pour UEditor / TipTap : ajouter si besoin `vite.optimizeDeps.include` pour les paquets `prosemirror-*` (voir docs Nuxt UI Editor).
- Persistance des `.md` : **commit GitHub via API côté serveur, puis CI** (décision dans `PLAN.md`). Pas d’écriture directe du filesystem en production. Les brouillons peuvent aller en D1/KV.

## Definition of done (chaque étape)

- `pnpm dev` démarre.
- `pnpm build` passe (les erreurs OG image déjà connues sur d’anciennes miniatures WP ne bloquent pas si `failOnError` n’est pas activé ; ne pas en ajouter de nouvelles).
- Aucun secret dans le diff. Aucun deploy.
- Résumer ce qui a changé, comment le vérifier, et ce qui reste.
