function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
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

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

type TPalette = { r: number; g: number; b: number }[]
type TPaletteName = 'rainbow' | 'fire' | 'ocean' | 'pastel' | 'forest'

export const palette: Record<TPaletteName, (() => TPalette)> = {
  rainbow: () => {
    const palette = [];
    for (let i = 0; i < 100; i++) {
      const hue = (i * 360 / 100) % 360;
      const rgb = hsvToRgb(hue / 360, 1, 1);
      palette.push(rgb);
    }
    return palette;
  },
  fire: () => {
    const palette = [];
    for (let i = 0; i < 100; i++) {
      const r = Math.min(255, i * 8);
      const g = Math.min(255, i * 4);
      const b = Math.min(255, i * 2);
      palette.push({ r, g, b });
    }
    return palette;
  },
  ocean: () => {
    const palette = [];
    for (let i = 0; i < 100; i++) {
      const r = Math.min(255, i * 2);
      const g = Math.min(255, i * 4);
      const b = Math.min(255, i * 8);
      palette.push({ r, g, b });
    }
    return palette;
  },
  forest: () => {
    const palette = [];
    for (let i = 0; i < 100; i++) {
      const r = Math.min(255, i * 3);
      const g = Math.min(255, i * 6);
      const b = Math.min(255, i * 2);
      palette.push({ r, g, b });
    }
    return palette;
  },
  pastel: () => {
    const palette = [];
    for (let i = 0; i < 100; i++) {
      const r = 128 + Math.floor(127 * Math.sin(i * 0.1));
      const g = 128 + Math.floor(127 * Math.sin(i * 0.1 + 2));
      const b = 128 + Math.floor(127 * Math.sin(i * 0.1 + 4));
      palette.push({ r, g, b });
    }
    return palette;
  }
}
