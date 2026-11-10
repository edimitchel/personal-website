# PLAN — Nuxt UI + admin /admin (personal-website)

Décisions figées pour cette refonte. Les étapes sont séquentielles et vérifiables. Respecter `AGENTS.md`.

## Décisions

### 1. UnoCSS vs Tailwind — verdict

**Officiellement, Nuxt UI v4 ne tourne pas sans Tailwind CSS.** L’installation documentée impose `pnpm add @nuxt/ui tailwindcss` et :

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

Sources officielles :

- https://ui.nuxt.com/docs/getting-started/installation/nuxt
- https://ui.nuxt.com/docs/getting-started/theme/design-system
- https://ui.nuxt.com/docs/getting-started/migration

Les demandes de support UnoCSS côté Nuxt UI sont fermées / non planifiées (couplage profond à l’API Tailwind, y compris les utilitaires récents) :

- https://github.com/nuxt/ui/issues/196
- https://github.com/nuxt/ui/issues/849

**Pont communautaire** (non officiel) : le module [`unocss-nuxt-ui`](https://github.com/canstand/unocss-nuxt-ui) (npm `1.2.2`, juin 2026, ~120 dl/semaine) retire le plugin Vite Tailwind, injecte `presetWind4` + `presetNuxtUI()`, et synchronise `app.config.ts`. Démo / annonce : https://www.reddit.com/r/Nuxt/comments/1rvhdks/i_built_a_bridge_to_use_nuxt_ui_with_unocss_no/. Limites assumées par l’auteur : pas de garantie sur la syntaxe Tailwind que `presetWind4` ne gère pas ; dernier test affiché avec `@nuxt/ui ^4.9`, alors que Nuxt UI est déjà en **4.12**. Risque de casse à chaque upgrade.

**Choix pour ce projet : quitter UnoCSS et suivre le chemin officiel Tailwind CSS v4 + `@nuxt/ui`.** Le site n’utilise pas Attributify ; les classes sont déjà style Tailwind, plus `presetIcons` et `presetTypography`. Les icônes passeront par `@nuxt/icon` (inclus dans Nuxt UI). On n’adopte `unocss-nuxt-ui` que si une contrainte impérative apparaît en cours de route.

### 2. UEditor — points d’appui

- Composant **`UEditor`** introduit dans **Nuxt UI v4.3.0** (17 déc. 2025), à prendre en **^4.3** au minimum, plutôt **dernière 4.x** (4.12+ au 10 nov. 2026). Docs : https://ui.nuxt.com/docs/components/editor — template : https://ui.nuxt.com/templates/editor
- Suite : `UEditorToolbar` (fixed / bubble / floating), `UEditorSuggestionMenu` (slash `/`), `UEditorDragHandle`, `UEditorMentionMenu` (`@`), `UEditorEmojiMenu` (`:`). Extensions TipTap custom via la prop `extensions` + `handlers`. Upload d’images : extension custom + `UFileUpload` (exemple officiel), à brancher sur R2.
- **Markdown in/out natif** : `content-type="markdown"`, `v-model` string. L’extension Markdown interne (Marked, GFM par défaut) sérialise le Markdown **classique**, pas le MDC Nuxt Content (`::About{props}`, slots, frontmatter).
- **MDC : à construire.** Les transformateurs `mdcToTiptap` / `tiptapToMDC` et les extensions TipTap MDC de Nuxt Studio **ne sont pas encore publiés** pour un usage hors Studio (prévu, issue toujours ouverte) : https://github.com/nuxt-content/nuxt-studio/issues/221 — https://content.nuxt.com/blog/studio-oss. Un paquet communautaire existe (`@hywax/mdc-tiptap`, peu mature). Pour ce site : frontmatter édité par **formulaires** (schémas `content.config.ts`) ; corps des articles/projets en Markdown GFM via UEditor ; composant `::About` (page d’accueil) via **extension TipTap + NodeView Vue** (ou formulaire structuré dédié), avec sérialisation MDC maison. Attention à la perte éventuelle (souligné, alignement, HTML legacy, entités `&#8211;`) : tests de round-trip obligatoires sur des fichiers réels de `content/`.
- Mentions : peu utiles ici (site perso) — on peut désactiver l’extension (`mention: false`).

### 3. Persistance — recommandation

Deux options viables sur Workers :

| | A. API GitHub → commit + CI actuelle | B. Overlay D1 lu en SSR |
|---|---|---|
| Source de vérité | les `.md` dans git (Content v3 inchangé) | D1 au runtime, git éventuellement en retard |
| Visiteurs | attendent le deploy CI (quelques minutes) | instantané si on **arrête le prerender** des pages contenu |
| Traduction | édition FR/EN dans l’admin (plus de Mistral) | à réécrire avec le prerender incrémental |
| Complexité | admin + token GitHub serveur | admin + lecture/écriture D1 + stratégie cache |

**Recommandation : A**, avec brouillons en D1/KV et images en R2. On garde Content v3, la CI `build-deploy.yml` et le prerender. L’admin appelle une API serveur (token GitHub uniquement côté Worker, jamais dans le navigateur) qui commit sur la branche prévue ; la CI déploie. Les brouillons ne sont pas publics tant qu’on n’a pas publié. Option B seulement si la publication publique instantanée redevient non négociable (il faudra alors cesser de pré-rendre `/`, `/articles/*`, `/projects/*`, `/legal`).

### 4. Traduction — dans l’admin, pas par Mistral

La traduction automatique Mistral (scripts `translate` / `translate:publish`, PR de traduction dans la CI) est retirée. Les fichiers déjà traduits dans `content/*/fr/` restent la version française publiée. L’UI i18n (chaînes de chrome, locales) ne change pas.

La traduction du contenu se fera dans `/admin`, plus tard :

- édition **FR et EN côte à côte** pour chaque article, projet ou page ;
- indicateur **manquante** (pas de fichier dans l’autre langue) ou **obsolète** (la source a changé depuis la traduction) ;
- publication par le même commit GitHub que le reste du contenu, sans appel à une API de traduction.

Auth admin (étape dédiée) : **Cloudflare Access** devant `/admin` (zéro code métier) + token GitHub côté serveur. Alternative : OAuth GitHub session, plus de code à maintenir.

---

## Inventaire design actuel → thème Nuxt UI

Fichiers sources : `unocss/uno.config.ts`, `app/assets/style.css`, `app/app.vue`, `app/layouts/default.vue`, `app/app.config.ts`, `nuxt.config.ts` (`fonts`, `colorMode`).

### Tokens

| Token actuel | Valeur light (`:root` / `html.light-mode`) | Valeur dark (`html.dark-mode`) | Cible Nuxt UI |
|---|---|---|---|
| Page background | `#fff` (`html.light-mode`) | `#000` (`html.dark-mode`) | `--ui-bg` / fond `bg-default` ; garder le calque `#app::after` (`bg-foreground` à 80 % + mask dégradé) |
| `background` (mal nommé : c’est la **couleur de texte**) | `#000000` | `#ffffff` | `text-highlighted` / `--ui-text` — migrer `text-background` vers le token sémantique UI |
| `foreground` (surfaces : cartes, calque) | `#ffffff` | `#333333` | `bg-default` / `bg-muted` selon le contraste ; ne pas conserver le nom inversé |
| `primary-50` … `primary-950` | gray Tailwind (`#f9fafb` … `#030712`), DEFAULT `#6b7280` | **échelle inversée** (50 sombre, 950 clair) | Définir `--color-gray-*` identiques au light ; `ui.colors.primary: 'gray'`, `neutral: 'gray'`. En dark, **ne pas inverser toute la palette** : remplacer les `text-primary-800` / `bg-primary-200` par des tokens sémantiques (`text-muted`, `bg-elevated`, badges) pour retrouver le même contraste |
| Fonts | Gabarito 400–900 (sans **et** serif), Source Code Pro 400–500 (mono) | idem | `@theme { --font-sans/serif: 'Gabarito'; --font-mono: 'Source Code Pro'; }` (déjà chargées par `@nuxt/fonts`) |
| Breakpoints | défaut Wind4 (`sm`, `md`, `lg` — pas de custom) | | laisser les breakpoints Tailwind v4 par défaut |
| Layout | `.container` : `px-4 mx-auto max-w-[600px] font-serif` ; `md:p-16 md:pt-4` | | `UContainer` custom ou conserver la classe, `app.config` typography |
| Color mode | `@nuxtjs/color-mode`, classes **`light-mode` / `dark-mode`** (suffixe `-mode`), préférence `system` | | Nuxt UI attend typiquement `.dark`. Pendant la cohabitation, soit `colorMode.classSuffix` aligné, soit double sélecteur. À trancher dès l’étape 1 sans casser le thème Uno restant |
| Typo contenu | `presetTypography()` + classe `prose` (+ `text-background`) | | Prose Nuxt UI (`ui.prose` / composants Prose de Content) calé sur Gabarito, liens `primary`, code mono |
| Icones | `presetIcons` : `i-logos-*`, `i-line-md-*`, `i-heroicons-*`, `i-mdi-*`, `i-ic-*`, `i-skill-icons-*`, `i-unjs-*` ; safelist `unocss/techIcons.ts` | | `@nuxt/icon` + mêmes collections Iconify ; garder `getTechIcon()` |
| Mouvement | `style.css` : transitions de page `fade` / `up` / `rise` / `balance` ; `html` `transition-colors 300ms` | | conserver le fichier d’animations ; ne pas les remplacer par les motions Nuxt UI sans comparaison |
| Shortcuts Uno | aucun | | — |

### Composants visuels à reproduire (ne pas jeter)

Header (logo typo `font-900`, nav uppercase, emojis, socials, toggle thème), Footer `font-mono`, `Background` / `CircleBackground` / `Vision` / `CurvedText` / `MessageCarousel` / `SpotlightCard`, cartes projet, `TypeBadge`, liste d’articles, `ContactForm` (hold-to-send), `SiblingNavigation`, OG image Satori, page About (skills, stack, passions, entreprise).

Beaucoup de styles sont en directives `--uno:` dans les SFC : les réécrire en classes Tailwind / `ui` slots au moment de la migration du composant, pas avant.

---

## Étapes

### Étape 1 — Installer Nuxt UI (Tailwind officiel) et poser le thème, sans casser le site

Voir `PROMPT-1.md` (prompt à coller dans Grok CLI).

Vérifications :

- [ ] `@nuxt/ui` + `tailwindcss` dans les dépendances, module déclaré, CSS `@import "tailwindcss"; @import "@nuxt/ui";` + tokens `@theme`
- [ ] `app.vue` enveloppe l’app avec `UApp`
- [ ] Fonts Gabarito / Source Code Pro et palette gray branchées ; dark mode toujours fonctionnel
- [ ] UnoCSS encore présent : le site public (accueil, projets, un article, legal, toggle thème) est visuellement comparable
- [ ] `pnpm dev` et `pnpm build` passent ; aucun deploy, aucun secret

### Étape 2 — Migrer le chrome et les pages publiques vers Nuxt UI, retirer UnoCSS

- Remplacer `prose` Uno par la typo Nuxt UI / Content Prose.
- Migrer Header, Footer, layout, cartes, badges, formulaire de contact, navigation, About : classes + éventuellement composants `UButton`, `UBadge`, `UForm`, `UContainer`.
- Remplacer `i-*` Uno par `UIcon` / classes Iconify supportées par `@nuxt/icon`. Conserver `unocss/techIcons.ts` (le déplacer hors de `unocss/`).
- Aligner `colorMode` sur `.dark` une fois Uno retiré.
- Retirer `@unocss/nuxt`, presets, `unocss/uno.config.ts`, extracteur MD, `uno.config.ts`, directives `--uno:`, override `unocss` dans `nuxt.config.ts`.
- Vérifications : same pages que l’étape 1, **light et dark**, viewport mobile et `md` ; `pnpm build` ; plus aucune import unocss dans le graphe (sauf mention historique).

### Étape 3 — Squelette `/admin` + persistance GitHub (brouillons D1/KV)

- Routes `/admin` (index collections, liste, édition), layout admin distinct, `robots` noindex.
- API serveur uniquement : lire un fichier contenu (git ou Content), enregistrer un brouillon (D1 ou KV), **publier = commit GitHub** (Contents ou Git Data API) sur une branche dédiée ou `main` selon ce que Michel tranchera au moment de l’implémentation.
- Token GitHub uniquement en secret Worker / `.dev.vars` local (déjà prévu de ne pas le committer). Ne pas configurer le secret prod sans demande.
- Frontmatter : formulaires générés depuis `content.config.ts` (après alignement des enums `status` / `type` qui divergent du contenu réel — à corriger ici ou juste avant).
- Traduction : pour chaque contenu, éditeur FR/EN côte à côte et indicateur manquante / obsolète (décision 4). Pas d’appel Mistral.
- Vérifications : en local, créer/editer un brouillon sans commit ; un commit de test uniquement si Michel l’autorise, jamais sur `main` prod. Build OK. `/admin` non lié dans le header public.

### Étape 4 — UEditor custom (Markdown, toolbar, slash, images R2, MDC About)

- Intégrer `UEditor` `content-type="markdown"` + toolbar + slash menu + drag handle.
- Images : extension d’upload → `POST` Worker → R2 (`BLOB`) → URL insérée en Markdown.
- Round-trip : prendre au moins 2 articles FR réels (un simple, un avec images WP / HTML) et 1 projet, vérifier que sérialiser puis reparser ne détruit pas le corps.
- Extension MDC pour `::About` (ou écran formulaire dédié à la page d’accueil).
- Vérifications : édition + aperçu, upload image vers R2 en `wrangler dev` (sans toucher au bucket prod si un binding de preview / local suffit), aucune régression publique.

### Étape 5 — Auth admin

- Cloudflare Access devant `/admin` (préférence) **ou** session OAuth GitHub. Documenter le branchement (sans appliquer les règles Access en prod sans demande).
- Vérifier que les API d’écriture refusent les requêtes non authentifiées.
- Vérifications : `/admin` inaccessible sans auth en configuration documentée ; les pages publiques restent ouvertes.

### Étape 6 — Nettoyage

- Schémas Content alignés (`status`, `type`, champs requis manquants).
- Dead code, README à jour (plus le starter NuxtHub), scripts, dépendances (`drizzle` / `@libsql` aujourd’hui inutilisés dans l’app, à confirmer avant suppression).
- Décider du sort de l’ancienne conf `content.preview.api` (api.nuxt.studio) : la retirer si l’admin maison la remplace.
- Vérifications : `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm build` ; diff final relu ; toujours pas de deploy prod.
