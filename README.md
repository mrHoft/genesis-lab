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
    ├── src/
    │   ├── api/         # Api services
    │   └── app/         # Angular application
    └── dist/            # Bundled static files (used by server)
```

### Installation
1. Clone project
2. Install Deno (https://deno.com/)
2. Install dependencies (`npm install`)
3. Install Postgres if not exist (depend of your system)
4. Define DB_HOST and DB_PORT depend of your database (`server/.env.dev`)
5. Build client static files (`npm run build`)
6. Start server (`deno task server`)
7. Application will be available on http://localhost:3004 (by default)

### Commands:
| Command | Description |
| ---- | ---- |
| npm run test | Client components tests |
| npm run lint | Client eslint checks |
| npm run client | Execute client app |
| npm run server | Execute server app |
| npm run build && npm start | Start server |

### Core focus areas
The client part of this app based on TypeScript, Angular, and scalable web application development with latest researches and best practices.

#### Quality & Integration
RxJS was used for complex asynchronous events (e.g., API calls, websockets) due to its powerful operators for transformation and error handling. Signals are adopted for local component state and template reactivity, offering superior simplicity, automatic dependency tracking, and optimized change detection. This approach ensures  was used the right tool for the job: RxJS for events over time, and Signals for values over time.

#### Performance
![performance](/docs/images/lighthouse.png)

### Self-assessment table
| Points | Item | Evidence |
| ---- | ---- | ---- |
| **1. Signals & Reactivity** |||
| 20 | Single source of truth with signals for one major feature | client/src/app/pages/gallery/gallery.ts:25, client/src/app/pages/generator/generator.ts:39 |
| 15 | computed values that are used in templates or logic for that feature | client/src/api/user.service.ts:19, client/src/app/components/loader/loader.ts:37, client/src/app/pages/savings/savings.ts:26 |
| 15 | effect with clean-up (unsubscribe/teardown) that trigger a real side effect | client/src/app/components/modal/modal.service.ts:49, client/src/app/pages/generator/generator.ts:64 |
| 0/15 | Bridge RxJS ↔ Signals: convert 3+ Observables with toSignal | |
| 6/10 | Signal inputs (input()) in 3+ components to simplify component APIs | client/src/app/components/toggle/toggle.ts:10, client/src/app/pages/generator/generator.ts:31 |
| 5 | Signal queries (viewChild, contentChild) | client/src/app/pages/generator/generator.ts:35, client/src/app/pages/gallery/gallery.ts:28 |
| 0/10 | Use untracked() or a custom equality to avoid extra updates | |
| **1-b. Quality & Integration** |||
| 6 | No reactive loops / leaks | effects don’t re-trigger themselves |
| 6 | Useful computed | each computed replaces heavy template logic |
| 6 | Clear boundaries | no duplicate state (Signal + Subject) without a reason |
| 6 | Performance awareness | [performance](https://github.com/mrHoft/genesis-lab/blob/develop/README.md#performance) |
| 0/6 | Tested behavior | |
| 6 | Short rationale | [integration](https://github.com/mrHoft/genesis-lab/blob/develop/README.md#quality--integration) |
| **2. Routing & Navigation** |||
| 25 | Functional routes with lazy loadComponent | client/src/app/app.routes.ts |
| 20 | Guards/resolvers with typed data | client/src/app/app.routes.ts |
| 15 | withComponentInputBinding() | client/src/app/app.config.ts:11 |
| 20 | Data prefetch or custom preloading strategy | client/src/app/pages/gallery/gallery.resolver.ts |
| 10 | Error route and 404 page, safe redirects | client/src/app/app.routes.ts |
| 0/20 | Deep linking | |
| **3. Testing – up** |||
| 50/50 | Unit tests | client/src/app/components/**/*.spec.ts |
| 0/50 | E2E tests| |
| 0/20 | Mock HTTP, test interceptors and error states | |
| 0/10 | Use a component testing library/harness | |
| **4. TypeScript & Typing** |||
| 20 | strict: true | client/tsconfig.json |
| 15 | Good domain models with generics and type guards | client/src/api/storage.ts:24 |
| 5 | utility types (Pick, Partial, Omit) | client/src/api/user.service.ts:39, client/src/api/gallery.service.ts:16 |
| **5. Architecture & Components** |||
| 0/30 | Feature-sliced structure | |
| 20 | Reusable components | client/src/app/components |
| 0/20 | Useful attribute or structural directives | |
| 0/10 | DI patterns: injection tokens for config, clean boundaries | |
| 0/10 | Well-designed pure pipes with strong typing |
| **6. HTTP & Data** |||
| 0/25 | Typed HttpClient layer, interceptors | |
| 20 | Consistent error handling with user-friendly messages | client/src/api/message.ts |
| 0/20 | Cancel in-flight requests on navigation | |
| 0/15 | Local cache with invalidation | |
| **7. Reactive Forms** |||
| 40 | Complex form with custom validators | client/src/app/pages/profile/profile.ts |
| 0/15 | Dynamic fields with FormArray | |
| 0/15 | Save draft and restore form state | |
| 0/10 | Keyboard access, labels, aria-describedby for errors | |
| **8. UI, Styling & Theming** |||
| 25 | Design tokens with CSS custom properties, theme switch (dark/light) saved to storage | client/src/app/components/theme/theme.ts |
| 15 | Responsive layout (BreakpointObserver or modern CSS) | client/src/app/pages/generator/generator.ts:76 |
| 0/10 | Angular animations | |
| 20 | Good empty/loading/error states | client/src/app/components/loader |
| **9. Content & Templates** |||
| 0/20 | Content projection with selectors, meaningful slots | |
| 20 | ngTemplateOutlet, ng-container, new control flow to simplify DOM | client/src/app/components/modal/modal.html:10 |
| **10. Performance** |||
| 20 | Code-splitting and lazy loading for heavy parts | Generator uses splitted parts, such as palettes and fractal |
| 20 | Image lazy loading and virtual scroll for large lists | infinite scroll is used at Gallery page |
| 20 | Performance budget in README + measured Lighthouse gains | [performance](https://github.com/mrHoft/genesis-lab/blob/develop/README.md#performance) |
| **11. Backend & Data Persistence**|||
| 40 | own backend with docs | [server docs](https://github.com/mrHoft/genesis-lab/blob/develop/doc.md) |
| 20 | Auth with JWT/OAuth2, protected routes | server/router/user.ts:81 |
| 0/20 | Realtime features (WebSocket or Firestore realtime) | |
| **12. Accessibility** |||
| 0/20 | Keyboard navigation and focus management | |
| 0/20 | Proper semantics and ARIA for forms, dialogs, menus | |
| **13. DevOps, CI & Docs** |||
| 20 | CI pipeline: lint + unit tests + build + preview | .github/workflows/deploy.yml |
| 20 | Clear README with run steps, env variables, architecture diagram | [readme](https://github.com/mrHoft/genesis-lab/blob/develop/README.md) |
| 10 | Release notes/changelog and issue templates | presents |
| 10 | Error monitoring (for example, Sentry) or remote logging | [deno deploy logs](https://dash.deno.com/projects/genesis-lab/logs) |
| **14. Internationalization** |||
| 0/20 | Two languages using Angular i18n or ngx-translate | |
