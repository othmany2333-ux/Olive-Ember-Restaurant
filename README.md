# Olive & Ember | Restaurant Management & Ordering Demo

A front-end **React.js** course project developed with **Vite, React Router and Material UI (MUI)**. It demonstrates role-based routes, reusable components, Hooks, Context state management, CRUD, sorting and searching, visual reports, user messages and review moderation.

> **Educational demo, not a production service.** No server, shared database, real payment provider, or delivery tracking is included. Credentials and all other data are kept in the current browser's `localStorage`. Never enter a real password or sensitive information.

## Requirements

- Node.js 20+ (prefer the current supported LTS version)
- npm and a browser
- Network access on the first install to download the dependencies

## Run it

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173/`.

```bash
npm test        # deterministic logic tests (no npm installation needed)
npm run build   # verify a production build (requires npm install)
npm run preview # preview that build
```

## Demonstration accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@oliveember.test` | `Admin123!` |
| Customer | `guest@oliveember.test` | `Guest123!` |

Registering a new account assigns the customer role. **Data is isolated to the browser**; a second device will not see the first device's orders.

## Routes and functionality

| Path | Audience | Main responsibility |
| --- | --- | --- |
| `/` | Visitor | Public landing page, story, featured dishes, approved guest reviews |
| `/about` | All | Restaurant profile |
| `/menu` | All | Browse, search, category filtering, sorting and add to cart |
| `/contact` | All | Send message to the manager inbox in the current browser |
| `/login`, `/register` | Visitor | Demo authentication |
| `/cart` | All (checkout requires user) | Bag, quantities, demo checkout |
| `/discover` | Customer | Personalized home after login |
| `/account` | Customer | Orders and profile editing |
| `/messages` | Customer | Send private messages / reviews; view own submissions |
| `/admin` | Admin | Overview, CRUD menu, orders, categories, messages, users, chart reports |

Features:

- **Customer:** sign up/in/out, browse menu, search/filter/sort, cart, order history, edit name/email, send messages or submit reviews.
- **Manager:** add/update/delete dishes, manage categories, change order statuses, moderate reviews (approve/reject), mark private messages read, change *other* account roles, view chart summaries.
- **Public:** approved reviews displayed on the homepage; private messages never displayed publicly.
- **Role navigation:** dedicated customer and admin navigation; MUI mobile drawer and admin Tools menu drawer can be toggled.
- **MUI:** components, dialogs, snackbars, forms, responsive layout and a custom theme.

## Code organization

```text
src/
  App.jsx                     # Route map and role protection
  main.jsx                    # Providers and app bootstrap
  theme.js                    # Material UI theme
  styles.css                  # Responsive design and layout
  assets/                     # Local, original-style illustrative SVG menu art
  components/                 # Reusable UI, admin panels, protected routes
  contexts/                   # AuthContext and RestaurantContext
  data/                       # Initial demo menu
  hooks/                      # useLocalStorage custom hook
  pages/                      # Public, customer, and manager pages
  utils/                      # Pure validation, sorting and summary logic
 tests/                       # Node.js test files
```

## Short demonstration for the instructor

1. Visit `/` to explain the public landing experience; inspect the responsive menu in a narrow browser window.
2. Open `/menu`; filter, search and sort the dishes.
3. Sign in with the customer demo account; open the separate customer home `/discover`.
4. Add dishes to the bag, change quantities and place a sample order; view it in `/account`.
5. Update the customer profile, send a review from `/messages`, sign out.
6. Sign in as the manager; open `/admin`, update the order, perform dish CRUD, manage categories, approve the review, examine users and reports.
7. Return to the landing page and verify that the approved review appears.

## Caveats and verification

**The React build and interactive browser flow have not been executed in the file-creation environment because `npm install` could not reach the npm registry (`EAI_AGAIN`).** Pure JavaScript tests are provided and can be run without dependencies; run `npm install`, `npm run build`, and manually test the role-dependent flows on your own machine before submitting.

The app's authentication and role gates are teaching examples, not a real security boundary. A production site would need a backend, hashed passwords, sessions, authorization checks, validation, and a database.

## Submission

Submit the **GitHub repository link by email** after your instructor approves the idea. Include source code, component files and assets (exclude `node_modules`), plus the accompanying project documentation. Replace placeholder student information, check originality requirements and be prepared to explain the code.
