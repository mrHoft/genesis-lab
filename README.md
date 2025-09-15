# GenesisLab
A service to create, share, view and like pictures generated based on mathematical sets.
This project demonstrates how mathematical functions can generate complex and visually stunning patterns.

<div align="center">

![deno](https://badge-service.deno.dev/plain?title=Deno&icon=deno&value=2.5)
![angular](https://badge-service.deno.dev/plain?title=Angular&icon=angular&value=20.1)

</div>

### Features
1. Manage user account via Deno + Postgres server:
  - Auto creating anonymous account.
  - Profile editing.
  - Auth by token or by credentials.
  - User savings and global gallery.
2. Generation:
  - Interactive Zooming: zoom in to explore intricate details or zoom out for a broader view
  - Multiple Color Palettes: several pallets to visually appealing color schemes
  - Responsive Design: clean UI with a dark/light theme that highlights the fractal beauty
  - HSV to RGB color conversion for smooth gradients
  - Pure TypeScript/JavaScript: no external libraries
3. Gallery:
  - User saved images are available in user profile.
  - All created images are available through the gallery.
  - Gallery can be used to receive likes and review used algorithm arguments.

### How It Works
As an example, the Mandelbrot set is created by iterating the function f(z) = z² + c for complex numbers. Each point on the canvas is colored based on how quickly the iteration diverges (if at all), creating the intricate patterns characteristic of fractals.

### Deno server
- Serve API routes under /api/*
- Serve static files from ../client/dist/
- Serve index.html for all non-API routes (SPA support)
- Handle cors policy
- Apply appropriate caching headers
- Support client-side routing for Angular app

### File structure
```markdown
project/
├── server/
│   ├── db/migrations/   # Database scheme
│   ├── middleware/
│   ├── router/          # Endpoint route handlers
│   ├── services/        # Endpoint logic
│   └── server.ts        # Entry point
└── client/
    ├── src/             # Source files
    │   ├── api/         # Api services
    │   └── app/         # Angular application
    └── dist/            # Bundled static files (used by server)
```

### Installation
1. Clone project
2. Install Deno (https://deno.com/)
2. Install dependencies (`npm install`)
3. Define server environment (`cp server/.env.example server/.env`)
4. Install Postgres if not exist (depend of your system)
5. Define DB_HOST and DB_PORT depend of your database
6. Build client static files (`npm run client:build`)
7. Start server (`deno task server`)
8. Application will be available on http://localhost:3000 (by default)

### Core focus areas
The client part of this app based on TypeScript, Angular, and scalable web application development with latest researches and best practices.
#### Quality & Integration
RxJS was used for complex asynchronous events (e.g., API calls, websockets) due to its powerful operators for transformation and error handling. Signals are adopted for local component state and template reactivity, offering superior simplicity, automatic dependency tracking, and optimized change detection. This approach ensures  was used the right tool for the job: RxJS for events over time, and Signals for values over time.

### Self-assessment table
| Points | Item | Evidence |
| ---- | ---- | ---- |
| Signals & Reactivity |
| 20 | Single source of truth with signals for one major feature | client/src/app/pages/gallery/gallery.ts:25 |
| | | client/src/app/pages/generator/generator.ts:39 |
| 15 | computed values that are used in templates or logic for that feature | client/src/api/user.service.ts:19 |
| | | client/src/app/components/loader/loader.ts:37 |
| | | client/src/app/pages/savings/savings.ts:26 |
| 15 | effect with clean-up (unsubscribe/teardown) that trigger a real side effect | client/src/app/components/modal/modal.service.ts:49 |
| | | client/src/app/pages/generator/generator.ts:64 |
| 0/15 | Bridge RxJS ↔ Signals: convert 3+ Observables with toSignal | |
| 3/10 | Signal inputs (input()) in 3+ components to simplify component APIs | client/src/app/components/toggle/toggle.ts:10 |
| 0/5 | Signal queries (viewChild, contentChild) | |
| 0/10 | Use untracked() or a custom equality to avoid extra updates | |
| Quality & Integration |
| 6 | No reactive loops / leaks | effects don’t re-trigger themselves |
| 6 | Useful computed | each computed replaces heavy template logic |
| 6 | Clear boundaries | no duplicate state (Signal + Subject) without a reason |
| 0/6 | Performance awareness | >> profiler screenshot << |
| 0/6 | Tested behavior | |
| 6 | Short rationale | [readme](https://github.com/mrHoft/genesis-lab/blob/main/README.md#quality--integration) |
| Routing & Navigation |
| 25 | Functional routes with lazy loadComponent | client/src/app/app.routes.ts |
| 20 | Guards/resolvers with typed data | client/src/app/app.routes.ts |
| 0/15 | withComponentInputBinding() | |
| 20 | Data prefetch or custom preloading strategy | client/src/app/pages/gallery/gallery.resolver.ts |
| 10 | Error route and 404 page, safe redirects | client/src/app/app.routes.ts |
| 0/20 | Deep linking | |
| Testing – up |
| 0/50 | Unit tests | |
| 0/50 | E2E tests| |
| 0/20 | Mock HTTP, test interceptors and error states | |
| 0/10 | Use a component testing library/harness | |
| TypeScript & Typing |
| 20 | strict: true | client/tsconfig.json |
| 15 | Good domain models with generics and type guards | client/src/api/storage.ts:24 |
| 5 | utility types (Pick, Partial, Omit) | client/src/api/user.service.ts:39 |
| | | client/src/api/gallery.service.ts:16 |
| Architecture & Components |
| 0/30 | Feature-sliced structure | |
| 20 | Reusable components | client/src/app/components |
| 0/20 | Useful attribute or structural directives | |
| 0/10 | DI patterns: injection tokens for config, clean boundaries | |
| 0/10 | Well-designed pure pipes with strong typing |
| HTTP & Data |
| 0/25 | Typed HttpClient layer, interceptors | |
| 20 | Consistent error handling with user-friendly messages | client/src/api/message.ts |
| 0/20 | Cancel in-flight requests on navigation | |
| 0/15 | Local cache with invalidation | |
| Reactive Forms |
| 40 | Complex form with custom validators | client/src/app/pages/profile/profile.ts |
| 0/15 | Responsive layout (BreakpointObserver or modern CSS) | |
| 0/10 | Angular animations | |
| 20 | Good empty/loading/error states | client/src/app/components/loader |
| Content & Templates|
| 0/20 | Content projection with selectors, meaningful slots | |
| 20 | ngTemplateOutlet, ng-container, new control flow to simplify DOM | client/src/app/components/modal/modal.html:10 |
| Performance |
| 20 | Code-splitting and lazy loading for heavy parts | Generator uses splitted parts, such as palettes and fractal |
| 20 | Image lazy loading and virtual scroll for large lists | infinite scroll is used at Gallery page |
| 0/20 | Performance budget in README + measured Lighthouse gains | |
| Backend & Data Persistence|
| 40 | own backend with docs | [readme](https://github.com/mrHoft/genesis-lab/blob/main/doc.md) |
| 20 | Auth with JWT/OAuth2, protected routes | server/router/user.ts:81 |
| 0/20 | Realtime features (WebSocket or Firestore realtime) | |
| Accessibility |
| 0/20 | Keyboard navigation and focus management | |
| 0/20 | Proper semantics and ARIA for forms, dialogs, menus | |
| DevOps, CI & Docs |
| 0/20 | CI pipeline: lint + unit tests + build + preview | |
| 20 | Clear README with run steps, env variables, architecture diagram | [readme](https://github.com/mrHoft/genesis-lab/blob/main/README.md) |
| 10 | Release notes/changelog and issue templates | presents |
| 0/10 | Error monitoring (for example, Sentry) or remote logging | |
| Internationalization |
| 0/20 | Two languages using Angular i18n or ngx-translate | |
