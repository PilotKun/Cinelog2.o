# CineLog Development Logs

### [14-05-25, 21:33]
**Change**: Initial project setup: Created `logs.md`.
**File(s) Affected**: `logs.md`
**Reason**: To track all development changes as requested.

### [14-05-25, 21:33]
**Change**: PRD Clarification: `bestpractices.md` was not provided in the initial request. Standard software development best practices will be followed, including those outlined in the custom instructions (modularity, clear naming, comments, TDD principles where applicable, maintainability, performance, security, self-contained code, and reasonable file sizes). If `bestpractices.md` is provided later, it will be adopted.
**File(s) Affected**: N/A (Clarification logged)
**Reason**: To document adherence to coding standards and note missing documentation.

### [14-05-25, 21:33]
**Change**: Completed initial project setup: Vite + React + TS client, Express + TS server. Integrated Shadcn UI (v2.3.0 for Tailwind v3 compatibility), Tailwind CSS, and react-router-dom. Created basic LandingPage component and set up initial routing. Resolved TypeScript compiler option error. Deleted unused default Vite template files.
**File(s) Affected**: `client/package.json`, `client/package-lock.json`, `client/tsconfig.json`, `client/tsconfig.app.json`, `client/vite.config.ts`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/src/index.css`, `client/src/App.tsx`, `client/src/pages/LandingPage.tsx`, `client/components.json`, `client/src/lib/utils.ts`, `server/package.json`, `server/package-lock.json`, `server/tsconfig.json`, `server/src/index.ts`, `logs.md`. Deleted: `client/src/App.css`, `client/src/assets/react.svg`.
**Reason**: Foundational setup for the CineLog application as per PRD requirements. Addressed initial configuration issues and set up core UI library and navigation.

### [14-05-25, 21:33]
**Change**: Implemented custom dark theme. Set up backend user handling with PostgreSQL (table creation/verification via /api/users). Updated LandingPage to call API, handle state, and navigate. Configured Vite proxy for API calls.
**File(s) Affected**: `client/src/index.css`, `client/tailwind.config.js`, `server/package.json`, `server/package-lock.json`, `server/src/config/db.ts`, `server/src/index.ts`, `server/src/routes/userRoutes.ts`, `client/src/pages/LandingPage.tsx`, `client/vite.config.ts`, `logs.md`.
**Reason**: To implement core user identification, data storage initiation, and apply the specified visual theme as per PRD high-priority items.

### [14-05-25, 21:33]
**Change**: Set up TMDB API integration: created backend route for TMDB search proxy. Created basic SearchPage component with search functionality and results display. Added SearchPage route to App.tsx.
**File(s) Affected**: `.cursor/PRD.md`, `server/package.json`, `server/package-lock.json`, `server/src/routes/tmdbRoutes.ts`, `server/src/index.ts`, `client/src/pages/SearchPage.tsx`, `client/src/App.tsx`, `logs.md`.
**Reason**: To implement the high-priority Search Page feature, enabling users to find movies/series using the TMDB API.

### [15-05-25, 11:53] 
**Change**: Implemented Navbar component. Includes links to Search, Lists, and Profile pages, username display, and logout functionality. Created placeholder ProfilePage. Integrated Navbar into App.tsx to display on all authenticated pages.
**File(s) Affected**: `client/src/components/Navbar.tsx`, `client/src/App.tsx`, `client/src/pages/ProfilePage.tsx`, `logs.md`.
**Reason**: To fulfill the high-priority Navbar feature from the PRD, providing essential navigation for the application. 

### [15-05-25, 11:57] 
**Change**: Addressed Navbar visibility by making it fixed. Created a new `HomePage.tsx` with navigation buttons (Search, Lists, Profile). Updated `App.tsx` to route to `/home` after login and for the Navbar brand link. Ensured `LandingPage.tsx` correctly redirects to `/home` via context update and `App.tsx` routing.
**File(s) Affected**: `client/src/components/Navbar.tsx`, `client/src/pages/HomePage.tsx`, `client/src/App.tsx`, `logs.md`.
**Reason**: To improve user experience by providing a clear Home page after login and ensuring the Navbar is always visible and functional, as per user feedback. 