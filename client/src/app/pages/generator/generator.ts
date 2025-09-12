import { Component, effect, signal, inject, afterNextRender } from '@angular/core';

import { createThumbnail } from '~/app/utils/thumbnail';
import { ITERATIONS } from '~/data/const';
import { fractals, fractalTypes, type TFractalType } from '~/data/fractal';
import { paletteTypes, type TPalette, type TPaletteName } from '~/data/palette';
import { GalleryService } from '~/api/gallery.service';
import type { FractalData } from '~/api/types';
import { Fractal } from '~/app/utils/fractal';

const defaultFractal: FractalData = {
  fractal: 'mandelbrot',
  p1: 2,
  p2: 2,
  scale: 30000,
  x: -5000,
  y: 0,
  palette: 'ocean',
  invert: false,
  fill: false
}

@Component({
  selector: 'app-generator',
  standalone: true,
  templateUrl: './generator.html',
  styleUrl: './generator.css'
})
export class PageGenerator {
  readonly width = 512;
  readonly height = 512;
  readonly max = ITERATIONS
  readonly fillIndex = Math.floor(ITERATIONS / 4)

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private timer = 0
  readonly fractalData = signal<FractalData>(defaultFractal)
  readonly fractalName = signal<string>(fractals[defaultFractal.fractal].name);
  readonly paletteTypes = paletteTypes
  readonly palette: Record<TPaletteName, TPalette>
  readonly fractalBtns = fractalTypes.map(name => ({ id: name, icon: fractals[name].icon }))
  readonly renderTrigger = signal(0);

  private galleryService = inject(GalleryService)
  private fractal: Fractal

  constructor() {
    this.fractal = new Fractal(this.width, this.height)
    this.palette = this.fractal.palette

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
    this.fractalData.update(data => ({ ...data, scale: Math.max(5, Math.floor(data.scale * 0.8)) }));
    this.renderTrigger.update(v => v + 1);
  }

  public zoomOut(): void {
    this.fractalData.update(data => ({ ...data, scale: Math.min(50000, Math.floor(data.scale * 1.2)) }));
    this.renderTrigger.update(v => v + 1);
  }

  public handlePalette(name: TPaletteName) {
    this.fractalData.update(data => ({ ...data, palette: name }));
    this.renderTrigger.update(v => v + 1);
  }

  private getDefaults(id: TFractalType) {
    return {
      x: id === 'mandelbrot' ? -5000 : 0,
      y: 0,
      scale: id === 'newton' ? 50000 : 30000,
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
    const complexX = (centerX / 10000) + (x - this.width / 2) * (scale / 10000) / this.width;
    const complexY = (centerY / 10000) + (y - this.height / 2) * (scale / 10000) / this.height;

    this.fractalData.update(data => ({ ...data, x: Math.floor(complexX * 10000), y: Math.floor(complexY * 10000) }));
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
    const thumbnail = createThumbnail(this.fractal.render(props), 32, 32)
    this.galleryService.add({ props, thumbnail })
  }

  private initializeCanvas(): void {
    this.canvas = document.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
  }

  private renderFractal(): void {
    const imageData = this.fractal.render(this.fractalData())
    this.ctx.putImageData(imageData, 0, 0);
  }
}
