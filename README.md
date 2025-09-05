# GenesisLab

A beautiful and interactive visualization of the math fractals, rendered on a canvas. This project demonstrates how mathematical functions can generate complex and visually stunning patterns.

### Features
- Mandelbrot Set Rendering: Accurate implementation of the Mandelbrot fractal algorithm
- Interactive Zooming: Zoom in to explore intricate details or zoom out for a broader view
- Multiple Color Palettes: Cycle through several visually appealing color schemes
- Responsive Design: Clean UI with a dark theme that highlights the fractal beauty
- HSV to RGB color conversion for smooth gradients
- Pure TypeScript/JavaScript: No external libraries required

### How It Works
The Mandelbrot set is created by iterating the function f(z) = z² + c for complex numbers. Each point on the canvas is colored based on how quickly the iteration diverges (if at all), creating the intricate patterns characteristic of fractals.

### Deno server
✅ Serve API routes under /api/*

✅ Serve static files from ../client/dist/

✅ Serve index.html for all non-API routes (SPA support)

✅ Handle favicon and assets properly

✅ Apply appropriate caching headers

✅ Support client-side routing for Angular app

### File structure
```markdown
project/
├── server/
│   ├── middleware/
│   │   ├── cors.ts
│   │   └── static.ts
│   ├── router/
│   │   └── router.ts
│   └── server.ts
└── client/
    └── dist/
        ├── index.html
        ├── favicon.ico
        └── assets/
            ├── js/
            ├── css/
            └── images/
```
