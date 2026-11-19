# SMHP Sentinel Connect — Observer PWA

Installable app for community observers: create an account, set the area you
report from, file an activity report with an optional photo and short video, and
follow your reports through review.

The app talks to the Sentinel API's observer endpoints through
[`observerService.ts`](src/services/observerService.ts): accounts, areas and
reports are real, and a submitted report goes to the Sentinel team for review.

Sibling of the agent app (`Sentinel-Web`): same stack, same folder layout, same
dependency list. Unlike the agent app, **observers register themselves** — no
administrator invitation.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Create an account on the sign-up screen, or sign in with an existing observer
account. The API only answers origins it allows; `http://localhost:5173` (the
Vite dev server) is one of them.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the build (needed to exercise the service worker) |
| `npm run lint` | ESLint |

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Sentinel API base URL, including `/api/v1`. |
| `VITE_LANDING_URL` | Where the header's **← Home** link goes. |

## Screens

| Route | Screen |
| --- | --- |
| `/signup` | Create account, step 1 — name, email, mobile number, password |
| `/signup/area` | Create account, step 2 — state, LGA, optional ward and community, or skip |
| `/login` | Sign in |
| `/forgot-password` | Password recovery, step 1 — request a code by email |
| `/reset-password` | Password recovery, step 2 — the six-digit code and a new password |
| `/app` | Dashboard — counts by status, most recent report |
| `/reports` | My reports — filter and page are in the URL (`?status=&page=`) |
| `/reports/new` | Report wizard — activity → details → evidence → review (`?step=`) |
| `/reports/saved` | Confirmation after submitting |
| `/area` | Observation area and report breakdown by status |
| `/area/edit` | Change area |

A first-time visitor lands on **Create account**. Once anyone has signed in on
the device — or the link ends in `#login` — the app opens on **Sign in**.

## How it works

- **API layer.** [`api.ts`](src/services/api.ts) holds the endpoint paths,
  [`requests.ts`](src/services/requests.ts) the typed helpers over the
  `{success, message, data, meta}` envelope, and
  [`errors.ts`](src/services/errors.ts) turns every failure into one `ApiError`.
  [`observerService.ts`](src/services/observerService.ts) is the only file
  screens call; it maps API shapes into the display types in
  [`types.ts`](src/lib/types.ts).
- **Session.** Register and login return a bearer token (valid for a day) and
  the observer's profile. Both are kept in `localStorage` so the installed app
  reopens on the dashboard; the password is never stored. The profile is
  re-read from `/observer/me` when the API is reachable. A rejected token
  clears the session and returns to Sign in.
- **Sign-up and sign-in.** Observers sign in with their **email** and password.
  Sign-up step 1 collects name, email, mobile number and password and holds
  them in memory; step 2 picks the area and creates the account in one call.
  **Skip for now** creates the account without an area; the dashboard then
  reminds the observer to set one, and the report wizard sends them to set it
  first and back again. An email or number already in use sends the observer
  back to step 1 with the API's message.
- **Password recovery.** A six-digit code is emailed (valid for 10 minutes)
  and entered on `/reset-password` with the new password. It needs mail (SMTP)
  configured on the server; until then `/observer/metadata` reports
  `email_recovery_available: false` and the screen says recovery is
  unavailable.
- **Areas.** States, LGAs and wards come from `/observer/areas`, each list
  being the children of the choice above it
  ([`useAreas.ts`](src/hooks/useAreas.ts)). Names arrive in capitals and are
  shown in reading case.
- **Reports.** The dashboard and the area screen read `/observer/dashboard`;
  My reports is filtered and paged by the API
  ([`useReports.ts`](src/hooks/useReports.ts)).
- **Filing a report.** Three calls, as the API expects: save a private draft,
  upload the photo and clip to it, then send it for review. Each finished step
  is remembered in the draft, so pressing submit again after a dropped
  connection resumes instead of filing twice. Nothing reaches the review queue
  until the last call.
- **Report draft.** The wizard's answers and attachments live in
  [`DraftContext`](src/context/DraftContext.tsx), above the screens, so leaving
  the wizard for the dashboard and coming back loses nothing. The step is in the
  URL so the device's back button walks back through it; a deep link can't skip
  past unanswered steps.
- **Evidence.** One photo (JPEG, PNG or WebP, up to 10 MB) and one clip
  (MP4/MOV/WebM, up to 20 MB and 30 seconds). The clip's length is read from its
  metadata in the browser before it is accepted
  ([`media.ts`](src/lib/media.ts)); the server checks both again. Attachments
  stay private until they are scanned and approved.

### Not built yet

- Opening a single report, or answering one marked **Needs information** — the
  list shows the reviewer's note, but there is no edit screen.
- Finishing a draft left behind by an abandoned submission.
- Downloading an approved attachment.

## PWA

Hand-rolled, no plugin, same approach as the agent app.
[`public/sw.js`](public/sw.js) is network-first for navigations (falling back to
the cached shell), cache-first for hashed assets and fonts, and never caches
`/api/` calls. Manifest, icons and shortcuts are in [`public/`](public/).

The service worker is disabled in dev; use `npm run build && npm run preview` to
test install and offline launch. The API's CORS list doesn't include the preview
server's default port, so run it on the dev port to sign in:
`npm run preview -- --port 5173`.

## Structure

```
src/
  components/    UI primitives (ui/), pickers, AreaForm, BottomNav, InstallPrompt
  context/       auth / report draft — hooks in .ts, providers in .tsx
  hooks/         reports, areas, API metadata, video selection
  layout/        PhoneFrame, Screen, AuthLayout, AppLayout
  lib/           types, constants, formatting, validation, media checks
  pages/         auth · home · reports · area
  routers/       route table and the protected/public gates
  services/      observerService, endpoint map, request helpers, errors, session
```

## Notes

- Colours are hex tokens defined once on `:root` in
  [`index.css`](src/index.css) and read through Tailwind. Typography is Inter,
  with JetBrains Mono for the small uppercase tags.
- The app is light-only for now; there is no theme toggle.
- Button and text components take `size` / `tone` props for their variations.
  Pass `className` for layout (margins, alignment) only — two Tailwind classes
  for the same property don't override each other predictably.
