import { ITERATIONS } from "~/data/const";
import { fractals } from '~/data/fractal';
import { palette, paletteTypes, type TPalette, type TPaletteName } from '~/data/palette';
import type { FractalData } from '~/api/types';

export class Fractal {
  private max = ITERATIONS
  private fillIndex = Math.floor(ITERATIONS / 4)
  public readonly palette: Record<TPaletteName, TPalette>

  constructor(private width = 512, private height = 512) {
    this.palette = paletteTypes.reduce<Record<string, TPalette>>((acc, key) => {
      acc[key] = palette[key]()
      return acc
    }, {})
  }

  public render(data: FractalData): ImageData {
    const { fractal: fractalName, scale, p1, p2, x: centerX, y: centerY, palette: paletteName, invert, fill } = data;
    const imageData = new ImageData(this.width, this.height);
    const palette = this.palette[paletteName];
    const fractalFn = fractals[fractalName].fn;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cx = (centerX / 10000) + (x - this.width / 2) * scale / 10000 / this.width;
        const cy = (centerY / 10000) + (y - this.height / 2) * scale / 10000 / this.height;

        const iterations = fractalFn(cx, cy, p1, p2);
        const colorIndex = invert ? ITERATIONS - iterations : iterations
        const color = this.getColor(colorIndex, palette, fill);

        const index = (y * this.width + x) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = 255;
      }
    }

    return imageData
  }

  private getColor(iterations: number, palette: { r: number; g: number; b: number }[], fill?: boolean): { r: number; g: number; b: number } {
    if (iterations >= this.max) {
      return fill ? palette[this.fillIndex] : palette[0]
    }

    const colorIndex = iterations % palette.length;
    return palette[colorIndex];
  }
}
