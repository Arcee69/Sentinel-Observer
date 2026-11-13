# SMHP Sentinel Connect — Observer PWA

Installable app for community observers: create an account, set the area you
report from, file an activity report with an optional photo and short video, and
follow your reports through review.

**This build is a preview.** No account is created and no report leaves the
device — every screen says so in its banner. The data comes from
[`observerService.ts`](src/services/observerService.ts), which is the one file to
change when the observer endpoints exist.

Sibling of the agent app (`Sentinel-Web`): same stack, same folder layout, same
dependency list. Unlike the agent app, **observers register themselves** — no
administrator invitation.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

No credentials are needed. Any valid Nigerian mobile number signs in, or tap


| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the build (needed to exercise the service worker) |
| `npm run lint` | ESLint |

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Sentinel API base URL. Read by the axios instance; nothing calls it yet. |
| `VITE_LANDING_URL` | Where the header's **← Home** link goes. |

## Screens

| Route | Screen |
| --- | --- |
| `/signup` | Create account, step 1 — name, mobile number, password |
| `/signup/area` | Create account, step 2 — state, LGA, ward/community |
| `/login` | Sign in |
| `/forgot-password` | Password recovery (preview: sends nothing) |
| `/app` | Dashboard — counts by status, most recent report |
| `/reports` | My reports — filter and page are in the URL (`?status=&page=`) |
| `/reports/new` | Report wizard — activity → details → evidence → review (`?step=`) |
| `/reports/saved` | Confirmation after saving |
| `/area` | Observation area and report breakdown by status |
| `/area/edit` | Change area |

A first-time visitor lands on **Create account**. Once anyone has signed in on
the device — or the link ends in `#login` — the app opens on **Sign in**.

## How it works

- **Session.** The observer's name, number and area are kept in `localStorage`
  so the installed app reopens on the dashboard. The password is validated on
  the form and then dropped; it is never stored or passed on.
- **Reports.** Eight sample records plus anything saved this session, held in
  memory in `observerService.ts`. Signing out resets them, so the next person on
  the device starts clean. Screens read them through React Query
  ([`useReports.ts`](src/hooks/useReports.ts)).
- **Report draft.** The wizard's answers and attachments live in
  [`DraftContext`](src/context/DraftContext.tsx), above the screens, so leaving
  the wizard for the dashboard and coming back loses nothing. The step is in the
  URL so the device's back button walks back through it; a deep link can't skip
  past unanswered steps.
- **Evidence.** One photo (image, up to 10 MB) and one clip (MP4/MOV/WebM, up to
  20 MB and 30 seconds). The clip's length is read from its metadata in the
  browser before it is accepted ([`media.ts`](src/lib/media.ts)). Nothing is
  uploaded.

### Connecting the API

1. Replace the function bodies in `observerService.ts` with calls through
   [`instance.ts`](src/services/instance.ts). They are already async and return
   the display types in [`types.ts`](src/lib/types.ts), so screens and hooks
   don't change.
2. Carry the password from sign-up step 1 to wherever the account is created —
   today `Signup.tsx` deliberately discards it.
3. Add the token to `Session` and attach it in `instance.ts`, as the agent app
   does.
4. Remove `PreviewBanner` and the "demo" wording on the review and confirmation
   screens.

## PWA

Hand-rolled, no plugin, same approach as the agent app.
[`public/sw.js`](public/sw.js) is network-first for navigations (falling back to
the cached shell), cache-first for hashed assets and fonts, and never caches
`/api/` calls. Manifest, icons and shortcuts are in [`public/`](public/).

The service worker is disabled in dev; use `npm run build && npm run preview` to
test install and offline launch.

## Structure

```
src/
  components/    UI primitives (ui/), pickers, AreaForm, BottomNav, InstallPrompt
  context/       auth / report draft — hooks in .ts, providers in .tsx
  hooks/         reports query + save, video selection
  layout/        PhoneFrame, Screen, AuthLayout, AppLayout
  lib/           types, constants, formatting, validation, media checks
  pages/         auth · home · reports · area
  routers/       route table and the protected/public gates
  services/      observerService, session, axios instance, mock data
```

## Notes

- Colours are hex tokens defined once on `:root` in
  [`index.css`](src/index.css) and read through Tailwind. Typography is Inter,
  with JetBrains Mono for the small uppercase tags.
- The app is light-only for now; there is no theme toggle.
- Button and text components take `size` / `tone` props for their variations.
  Pass `className` for layout (margins, alignment) only — two Tailwind classes
  for the same property don't override each other predictably.
