import { Component, effect, signal, inject, afterNextRender } from '@angular/core';
import { createThumbnail } from '~/app/utils/thumbnail';
import { ITERATIONS } from '~/data/const';
import { fractals, fractalTypes, type TFractalType } from '~/data/fractal';
import { palette, type TPalette } from '~/data/palette';
import { GalleryService } from '~/api/gallery.service';
import type { FractalData } from '~/api/types';

const defaultFractal: FractalData = {
  fractal: 'mandelbrot',
  p1: 2,
  p2: 2,
  scale: 3,
  x: -0.5,
  y: 0,
  palette: 0,
  invert: false,
  fill: false
}

@Component({
  selector: 'app-mandelbrot',
  standalone: true,
  templateUrl: './mandelbrot.html',
  styleUrl: './mandelbrot.css'
})
export class Mandelbrot {
  readonly width = 512;
  readonly height = 512;
  readonly max = ITERATIONS
  readonly fillIndex = Math.floor(ITERATIONS / 4)

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private imageData!: ImageData;

  private timer = 0
  readonly fractalData = signal<FractalData>(defaultFractal)
  readonly fractalName = signal<string>(fractals[defaultFractal.fractal].name);
  readonly colorPalettes: TPalette[]
  protected thumbnail = signal('')
  readonly fractalBtns = fractalTypes.map(name => ({ id: name, icon: fractals[name].icon }))
  readonly renderTrigger = signal(0);

  private galleryService = inject(GalleryService)

  constructor() {
    this.colorPalettes = [
      palette.ocean(),
      palette.fire(),
      palette.forest(),
      palette.pastel(),
      palette.rainbow(),
      palette.grayscale()
    ]

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

  protected handleCreateThumbnail = () => {
    const dataUrl = createThumbnail(this.imageData, 32, 32)
    console.log('thumbnail length:', dataUrl.length)
    this.thumbnail.set(dataUrl)
  }

  public zoomIn(): void {
    this.fractalData.update(data => ({ ...data, scale: data.scale * 0.8 }));
    this.renderTrigger.update(v => v + 1);
  }

  public zoomOut(): void {
    this.fractalData.update(data => ({ ...data, scale: data.scale * 1.2 }));
    this.renderTrigger.update(v => v + 1);
  }

  public handlePalette(index: number) {
    this.fractalData.update(data => ({ ...data, palette: index }));
    this.renderTrigger.update(v => v + 1);
  }

  private getDefaults(id: TFractalType) {
    return {
      x: id === 'mandelbrot' ? -0.5 : 0,
      y: 0,
      scale: id === 'newton' ? 5 : 3,
      p1: id === 'newton' ? 1.5 : 2,
      p2: id === 'newton' ? 3 : 2,
    }
  }

  public handleFractal(id: TFractalType) {
    this.fractalData.update(data => ({ ...data, ...this.getDefaults(id), fractal: id }));
    this.fractalName.set(fractals[id].name);
    this.renderTrigger.update(v => v + 1);
  }

  public handleFractionalPower(value: string) {
    this.fractalData.update(data => ({ ...data, p1: Number(value) }));
    this.renderTrigger.update(v => v + 1);
  }

  public handleAsymmetricalPower(value: string) {
    this.fractalData.update(data => ({ ...data, p2: Number(value) }));
    this.renderTrigger.update(v => v + 1);
  }

  public handleInvert(value: boolean) {
    this.fractalData.update(data => ({ ...data, invert: value }));
    this.renderTrigger.update(v => v + 1);
  }

  public handleFill(value: boolean) {
    this.fractalData.update(data => ({ ...data, fill: value }));
    this.renderTrigger.update(v => v + 1);
  }

  public resetView(): void {
    this.fractalData.update(data => ({ ...data, ...this.getDefaults(data.fractal) }));
    this.renderTrigger.update(v => v + 1);
  }

  private setCenter = (x: number, y: number) => {
    const { scale, x: centerX, y: centerY } = this.fractalData();
    const complexX = centerX + (x - this.width / 2) * scale / this.width;
    const complexY = centerY + (y - this.height / 2) * scale / this.height;

    this.fractalData.update(data => ({ ...data, x: complexX, y: complexY }));
  }

  public handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.setCenter(x, y)
  }

  public handleWheel(event: WheelEvent): void {
    event.preventDefault();

    const now = Date.now()
    if (now - this.timer > 1000) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.setCenter(x, y)
      this.timer = now
    }

    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  public handleSave() {
    const props: FractalData = { ...this.fractalData() }
    console.log(props)

    const thumbnail = createThumbnail(this.imageData, 32, 32)
    this.galleryService.add({ props, thumbnail })
  }

  private initializeCanvas(): void {
    this.canvas = document.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.imageData = this.ctx.createImageData(this.width, this.height);
  }

  private renderFractal(): void {
    const { fractal, scale, p1, p2, x: centerX, y: centerY, palette: paletteIndex, invert, fill } = this.fractalData();
    const palette = this.colorPalettes[paletteIndex];
    const fractalFn = fractals[fractal].fn;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cx = centerX + (x - this.width / 2) * scale / this.width;
        const cy = centerY + (y - this.height / 2) * scale / this.height;

        const iterations = fractalFn(cx, cy, p1, p2);
        const colorIndex = invert ? ITERATIONS - iterations : iterations
        const color = this.getColor(colorIndex, palette, fill);

        const index = (y * this.width + x) * 4;
        this.imageData.data[index] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b;
        this.imageData.data[index + 3] = 255;
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private getColor(iterations: number, palette: { r: number; g: number; b: number }[], fill?: boolean): { r: number; g: number; b: number } {
    if (iterations >= ITERATIONS) {
      return fill ? palette[this.fillIndex] : palette[0]
    }

    const colorIndex = iterations % palette.length;
    return palette[colorIndex];
  }
}
