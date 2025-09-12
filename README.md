# GenesisLab

A service to create, share, view and like pictures generated based on mathematical sets. This project demonstrates how mathematical functions can generate complex and visually stunning patterns.

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
  - User created images are available through the gallery.
  - Gallery can be used to receive likes and review used algorithm arguments.

### How It Works
The Mandelbrot set is created by iterating the function f(z) = z² + c for complex numbers. Each point on the canvas is colored based on how quickly the iteration diverges (if at all), creating the intricate patterns characteristic of fractals.

### Deno server
✅ Serve API routes under /api/*

✅ Serve static files from ../client/dist/

✅ Serve index.html for all non-API routes (SPA support)

✅ Handle cors policy

✅ Apply appropriate caching headers

✅ Support client-side routing for Angular app

### File structure
```markdown
project/
├── server/
│   ├── db/migrations/  # Database scheme
│   ├── middleware/
│   ├── router/         # Endpoint route handlers
│   ├── services/       # Endpoint logic
│   └── server.ts       # Entry point
└── client/
    ├── src/             # Angular source
    └── dist/            # Bundled static files
```
