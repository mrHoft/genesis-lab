import { Component, effect, input, signal, computed, ChangeDetectionStrategy, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-mandelbrot',
  templateUrl: './mandelbrot.html',
  styleUrl: './mandelbrot.css'
})
export class Mandelbrot {
  readonly canvasWidth = 300;
  readonly canvasHeight = 300;
  readonly maxIterations = 100;

  readonly centerX = signal(-0.5);
  readonly centerY = signal(0);
  readonly scale = signal(3);
  readonly colorPaletteIndex = signal(0);
  readonly renderTrigger = signal(0);

  readonly colorPalettes = computed(() => [
    this.createRainbowPalette(),
    this.createFirePalette(),
    this.createOceanPalette(),
    this.createForestPalette(),
    this.createPastelPalette()
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

    const complexX = this.centerX() + (x - this.canvasWidth / 2) * this.scale() / this.canvasWidth;
    const complexY = this.centerY() + (y - this.canvasHeight / 2) * this.scale() / this.canvasHeight;

    this.centerX.set(complexX);
    this.centerY.set(complexY);
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
    this.imageData = this.ctx.createImageData(this.canvasWidth, this.canvasHeight);
  }

  private renderFractal(): void {
    const scale = this.scale();
    const centerX = this.centerX();
    const centerY = this.centerY();
    const palette = this.colorPalettes()[this.colorPaletteIndex()];

    for (let y = 0; y < this.canvasHeight; y++) {
      for (let x = 0; x < this.canvasWidth; x++) {
        const cx = centerX + (x - this.canvasWidth / 2) * scale / this.canvasWidth;
        const cy = centerY + (y - this.canvasHeight / 2) * scale / this.canvasHeight;

        const iterations = this.calculateMandelbrot(cx, cy);
        const color = this.getColor(iterations, palette);

        const index = (y * this.canvasWidth + x) * 4;
        this.imageData.data[index] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b;
        this.imageData.data[index + 3] = 255;
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private calculateMandelbrot(cx: number, cy: number): number {
    let zx = 0;
    let zy = 0;
    let iter = 0;

    while (iter < this.maxIterations) {
      const zx2 = zx * zx;
      const zy2 = zy * zy;

      if (zx2 + zy2 > 4) break;

      const newZx = zx2 - zy2 + cx;
      const newZy = 2 * zx * zy + cy;

      zx = newZx;
      zy = newZy;
      iter++;
    }

    return iter;
  }

  private getColor(iterations: number, palette: { r: number; g: number; b: number }[]): { r: number; g: number; b: number } {
    if (iterations === this.maxIterations) {
      return { r: 0, g: 0, b: 0 };
    }

    const colorIndex = iterations % palette.length;
    return palette[colorIndex];
  }

  private createRainbowPalette(): { r: number; g: number; b: number }[] {
    const palette = [];
    for (let i = 0; i < this.maxIterations; i++) {
      const hue = (i * 360 / this.maxIterations) % 360;
      const rgb = this.hsvToRgb(hue / 360, 1, 1);
      palette.push(rgb);
    }
    return palette;
  }

  private createFirePalette(): { r: number; g: number; b: number }[] {
    const palette = [];
    for (let i = 0; i < this.maxIterations; i++) {
      const r = Math.min(255, i * 8);
      const g = Math.min(255, i * 4);
      const b = Math.min(255, i * 2);
      palette.push({ r, g, b });
    }
    return palette;
  }

  private createOceanPalette(): { r: number; g: number; b: number }[] {
    const palette = [];
    for (let i = 0; i < this.maxIterations; i++) {
      const r = Math.min(255, i * 2);
      const g = Math.min(255, i * 4);
      const b = Math.min(255, i * 8);
      palette.push({ r, g, b });
    }
    return palette;
  }

  private createForestPalette(): { r: number; g: number; b: number }[] {
    const palette = [];
    for (let i = 0; i < this.maxIterations; i++) {
      const r = Math.min(255, i * 3);
      const g = Math.min(255, i * 6);
      const b = Math.min(255, i * 2);
      palette.push({ r, g, b });
    }
    return palette;
  }

  private createPastelPalette(): { r: number; g: number; b: number }[] {
    const palette = [];
    for (let i = 0; i < this.maxIterations; i++) {
      const r = 128 + Math.floor(127 * Math.sin(i * 0.1));
      const g = 128 + Math.floor(127 * Math.sin(i * 0.1 + 2));
      const b = 128 + Math.floor(127 * Math.sin(i * 0.1 + 4));
      palette.push({ r, g, b });
    }
    return palette;
  }

  private hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}
