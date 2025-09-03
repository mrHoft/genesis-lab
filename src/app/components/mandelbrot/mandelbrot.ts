import { Component, effect, signal, computed, afterNextRender } from '@angular/core';
import { palette } from '~/app/utils/palette';

type FractalFn = (x: number, y: number, p1?: number, p2?: number) => number;
type TFractalType = 'mandelbrot' | 'julia' | 'burningShip' | 'newton' | 'strangeAttractor' | 'lyapunov' | 'ifs' | 'plasma' | 'pickover'
const fractalTypes: TFractalType[] = ['mandelbrot', 'julia', 'burningShip', 'newton'] as const;
const defaultFractal: TFractalType = 'mandelbrot'
const maxIterations = 50;
const fractals: Record<TFractalType, { name: string, fn: FractalFn }> = {
  mandelbrot: {
    name: 'Mandelbrot',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = 0;
      let zy = 0;
      let iter = 0;

      while (iter < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;

        if (zx2 + zy2 > 4) break;

        const newZx = Math.pow(zx, p1) - Math.pow(zy, p2) + x;
        const newZy = 2 * zx * zy + y;

        zx = newZx;
        zy = newZy;
        iter++;
      }

      return iter;
    }
  },

  julia: {
    name: 'Julia Fractals',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = x;
      let zy = y;
      let iter = 0;
      const cx = -0.7;
      const cy = 0.27;

      while (iter < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;

        if (zx2 + zy2 > 4) break;

        const newZx = Math.pow(zx, p1) - Math.pow(zy, p2) + cx;
        const newZy = 2 * zx * zy + cy;

        zx = newZx;
        zy = newZy;
        iter++;
      }

      return iter;
    }
  },

  burningShip: {
    name: 'Burning Ship',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = 0;
      let zy = 0;
      let iter = 0;

      while (iter < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;

        if (zx2 + zy2 > 4) break;

        const newZx = Math.pow(Math.abs(zx), p1) - Math.pow(Math.abs(zy), p2) + x;
        const newZy = Math.abs(2 * zx * zy) + y;

        zx = newZx;
        zy = newZy;
        iter++;
      }

      return iter;
    }
  },

  newton: {
    name: 'Newton (Root-Finding)',
    fn: (x: number, y: number, p1: number = 3, p2: number = 1): number => {
      const tolerance = 1e-6;
      let zx = x;
      let zy = y;
      let iter = 0;

      while (iter < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        const magnitude = zx2 + zy2;

        if (magnitude < tolerance) break;

        const f = Math.pow(magnitude, p1 / 2) - 1;
        const df = p1 * Math.pow(magnitude, (p1 - 2) / 2);

        const newZx = zx - f * (zx / df) + p2 * 0.1 * Math.sin(zy);
        const newZy = zy - f * (zy / df) + p2 * 0.1 * Math.cos(zx);

        if (Math.abs(newZx - zx) < tolerance && Math.abs(newZy - zy) < tolerance) break;

        zx = newZx;
        zy = newZy;
        iter++;
      }
      return iter;
    }
  },

  strangeAttractor: {
    name: 'Strange Attractors (Orbit)',
    fn: (x: number, y: number, p1: number = 1.4, p2: number = 0.3): number => {
      let zx = 0.1;
      let zy = 0.1;
      let count = 0;

      for (let i = 0; i < maxIterations; i++) {
        const newZx = Math.sin(p1 * zy) - Math.cos(p2 * zx);
        const newZy = Math.sin(zx) - Math.cos(zy);

        zx = newZx;
        zy = newZy;

        if (i > 100) {
          const dist = Math.sqrt((zx - x) * (zx - x) + (zy - y) * (zy - y));
          if (dist < 0.1) count++;
        }
      }
      return count;
    }
  },

  lyapunov: {
    name: 'Lyapunov Fractals',
    fn: (x: number, y: number, p1: number = 3.5, p2: number = 0.5): number => {
      const sequence = "AB";
      const length = 100;
      let product = 1;
      let rn = 0;
      let yn = 0.5;

      for (let i = 0; i < length; i++) {
        rn = sequence.charCodeAt(i % sequence.length) === 65 ? p1 : p2;
        product *= Math.abs(rn * (1 - 2 * yn));
        yn = rn * yn * (1 - yn);
      }

      const lyapunovExp = Math.log(Math.abs(product)) / length;
      return Math.min(Math.max(lyapunovExp, -10), 10);
    }
  },

  ifs: {
    name: 'Iterated Function Systems',
    fn: (x: number, y: number, p1: number = 0.5, p2: number = 0.5): number => {
      const transformations = [
        { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6 },
        { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44 },
        { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6 },
        { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0 }
      ];

      let zx = 0;
      let zy = 0;
      let count = 0;

      for (let i = 0; i < 1000; i++) {
        const r = Math.random();
        const t = transformations[r < 0.01 ? 3 : r < 0.86 ? 0 : r < 0.93 ? 1 : 2];

        const newZx = t.a * zx + t.b * zy + t.e;
        const newZy = t.c * zx + t.d * zy + t.f;

        zx = newZx;
        zy = newZy;

        if (i > 100) {
          const dist = Math.sqrt((zx - x) * (zx - x) + (zy - y) * (zy - y));
          if (dist < p1 * 0.1) count++;
        }
      }
      return count * p2;
    }
  },

  plasma: {
    name: 'Plasma (Noise-Based)',
    fn: (x: number, y: number, p1: number = 1, p2: number = 1): number => {
      let value = 0;
      const size = 1;
      let initialSize = size;

      while (initialSize > 0.01) {
        const x1 = Math.floor(x / initialSize) * initialSize;
        const y1 = Math.floor(y / initialSize) * initialSize;
        const x2 = x1 + initialSize;
        const y2 = y1 + initialSize;

        const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
        const dx = fade((x - x1) / initialSize);
        const dy = fade((y - y1) / initialSize);

        const n1 = Math.sin(x1 * p1 + y1 * p2);
        const n2 = Math.sin(x2 * p1 + y1 * p2);
        const n3 = Math.sin(x1 * p1 + y2 * p2);
        const n4 = Math.sin(x2 * p1 + y2 * p2);

        value += (n1 * (1 - dx) + n2 * dx) * (1 - dy) + (n3 * (1 - dx) + n4 * dx) * dy;
        initialSize /= 2;
      }

      return Math.abs(value) * 50;
    }
  },

  pickover: {
    name: 'Pickover Stalks (Bioprocess)',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = 0;
      let zy = 0;
      let iter = 0;

      while (iter < maxIterations) {
        const sinX = Math.sin(zx);
        const cosY = Math.cos(zy);

        const newZx = Math.sin(p1 * zy) + Math.exp(p2 * cosY);
        const newZy = Math.sin(p1 * zx) + Math.exp(p2 * sinX);

        if (Math.abs(newZx - x) < 0.1 && Math.abs(newZy - y) < 0.1) {
          return iter;
        }

        zx = newZx;
        zy = newZy;
        iter++;
      }
      return maxIterations;
    }
  }
};

@Component({
  selector: 'app-mandelbrot',
  standalone: true,
  templateUrl: './mandelbrot.html',
  styleUrl: './mandelbrot.css'
})
export class Mandelbrot {
  readonly width = 512;
  readonly height = 512;

  readonly fractalName = signal<string>(fractals[defaultFractal].name);
  readonly centerX = signal(-0.5);
  readonly centerY = signal(0);
  readonly scale = signal(3);
  readonly colorPaletteIndex = signal(0);
  readonly renderTrigger = signal(0);
  readonly fractalType = signal<TFractalType>(defaultFractal);
  readonly fractionalPower = signal(2);
  readonly asymmetricalPower = signal(2);

  readonly colorPalettes = computed(() => [
    palette.rainbow(),
    palette.fire(),
    palette.ocean(),
    palette.forest(),
    palette.pastel()
  ]);

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private imageData!: ImageData;

  constructor() {
    afterNextRender(() => {
      this.initializeCanvas();
      this.renderFractal();
    });

    effect(() => {
      this.renderTrigger();
      this.fractionalPower();
      this.asymmetricalPower();
      this.fractalType();
      if (this.canvas) {
        this.renderFractal();
      }
    });
  }

  public zoomIn(): void {
    this.scale.set(this.scale() * 0.8);
    this.renderTrigger.update(v => v + 1);
  }

  public zoomOut(): void {
    this.scale.set(this.scale() * 1.2);
    this.renderTrigger.update(v => v + 1);
  }

  public cyclePalette(): void {
    this.colorPaletteIndex.set((this.colorPaletteIndex() + 1) % this.colorPalettes().length);
    this.renderTrigger.update(v => v + 1);
  }

  public cycleFractal(): void {
    const currentIndex = fractalTypes.indexOf(this.fractalType());
    const fractalType = fractalTypes[(currentIndex + 1) % fractalTypes.length]
    this.fractalName.set(fractals[fractalType].name)
    this.fractalType.set(fractalType);
  }

  public resetView(): void {
    this.centerX.set(-0.5);
    this.centerY.set(0);
    this.scale.set(3);
    this.renderTrigger.update(v => v + 1);
  }

  public handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const complexX = this.centerX() + (x - this.width / 2) * this.scale() / this.width;
    const complexY = this.centerY() + (y - this.height / 2) * this.scale() / this.height;

    this.centerX.set(complexX);
    this.centerY.set(complexY);
    // this.zoomIn();
  }

  public handleWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  private initializeCanvas(): void {
    this.canvas = document.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.imageData = this.ctx.createImageData(this.width, this.height);
  }

  private renderFractal(): void {
    const scale = this.scale();
    const centerX = this.centerX();
    const centerY = this.centerY();
    const palette = this.colorPalettes()[this.colorPaletteIndex()];
    const fractalFn = fractals[this.fractalType()].fn;
    const p1 = this.fractionalPower();
    const p2 = this.asymmetricalPower();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cx = centerX + (x - this.width / 2) * scale / this.width;
        const cy = centerY + (y - this.height / 2) * scale / this.height;

        const iterations = fractalFn(cx, cy, p1, p2);
        const color = this.getColor(iterations, palette);
        if (!color) {
          console.log(iterations, color)
        }

        const index = (y * this.width + x) * 4;
        this.imageData.data[index] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b;
        this.imageData.data[index + 3] = 255;
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private getColor(iterations: number, palette: { r: number; g: number; b: number }[]): { r: number; g: number; b: number } {
    if (iterations >= maxIterations) {
      return palette[0]  //{ r: 0, g: 0, b: 0 };
    }

    const colorIndex = iterations % palette.length;
    return palette[colorIndex];
  }
}
