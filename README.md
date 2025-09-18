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
