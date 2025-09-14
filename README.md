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
