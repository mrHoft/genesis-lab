import { ITERATIONS } from '~/data/const';

type FractalFn = (x: number, y: number, p1?: number, p2?: number) => number;

export type TFractalType = 'mandelbrot' | 'julia' | 'burningShip' | 'newton' | 'strangeAttractor'

export const fractalTypes: TFractalType[] = ['mandelbrot', 'julia', 'burningShip', 'newton'] as const;

export const fractals: Record<TFractalType, { name: string, fn: FractalFn, icon: string }> = {
  mandelbrot: {
    name: 'Mandelbrot',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = 0;
      let zy = 0;
      let iter = 0;

      while (iter < ITERATIONS) {
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
    },
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADpElEQVR4AbSWLzRsURTG97IWgUAgEAhUikJQKIKkKBSBoCuyogsEhaJIgkIRKIqpM2EmzISZMBNmwkzw5reXfdeec//Ne2veW+9z9tnft8/+7jn3HsbGx8d/sjA5OfnzPzEmGf/6xjLY0VCpBvKaw4f4F0uJBlg4XIycR8gz9zwxuTzEDISFzEHWQvBgbm5OpqamhNgjqzZmwMS2gM2TRq+ZmJiQXq8ns7OzMjMzo3J4AkZAHGLAgIlsDMV+7jU0hyOHAUafgwPkGT0iA0ba6EU+hgeWs0bT09OytrYmb29vMj8/L/1PV4zzeh+zRmSASUiS8wh5GpCjGbqnpycGNUEeoAHESvZ/+HjAQJ9L/e+LWJCXbXt7W5+WJ97a2opqLy8v5e7uTshhbnFxMdqNSPQbqAEWB7+52ABHUwNzUCwW5fPzU97f3+X29jaqu7i4kM3NTXl4eBA0BwcH0ZdhIuqJ1QBBEhDxpDQ2nhzx+vq6rKysEObi8fExVaMGbFFUxIDGYHV1VV8oXjIAx7bytvOE1OSBI7m/v9djoN70xGqABBNA7J+4VqvpNi4vL+tbznlj4Pr6GulQ2NnZkdPT00StGrDGKKw5OcCTkn9+fha2kvPGBLlRQA3YQjSnKU/IdvP27u7uGh2NmIkmQwadTidROcb12Wg0BFSrVSmXy7rl39/f+j2fn58nFv5NkgsqTc8fJHp/s9ULCwuytLSkbzdFfOdXV1dptUPneZg08cARdLtd/YXCdrVaLalUKvLy8hKr3dvbi+XyEhxrkkYNcAxGYoKYHOBomNOUC4XbjS+D3CigBliIZoDYTBDzxnPhlEolYStpzg6dnZ1BD4XX11e5ublJ1KoBa4yCGLTbbQGFQkFoyJEAOObszOHhISW54Go+OjoSHox6KyBWA5YIRwSYoNA4csRfX1/6tRDngaNL06gBFgVpIjhMGJgDjmZjY0N/652cnETlXL0fHx/CDqHhAkMPTGSxGrBk1mgFaDDCzvDHB+8E4IaEA2z58fGx/pbkuPiaqIELMWDANwmFzEOeRcnRBH5/f59BuD/IAzSAWMn+Dx9HBixpY1+X+B8eGMnixLygfCU0Z0cwZZzX+5i6yAATI20klwav8Y34OuB8ztYgb7GNAwYsyYgYEKcBHsDTkF9kGGg2m6T0ViVAA4hDxAyEQuYgLPRzeFCv1/XuIPbw2jCOGUBAMaMHOQ/PWex5YstnjYkGKMhbAD4EdSHy5n8AAAD///hk4J4AAAAGSURBVAMAG7ohlmxA46QAAAAASUVORK5CYII='
  },

  julia: {
    name: 'Julia Fractals',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = x;
      let zy = y;
      let iter = 0;
      const cx = -0.7;
      const cy = 0.27;

      while (iter < ITERATIONS) {
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
    },
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADoUlEQVR4AcSVITD8URDHd26GQCBICjMEzCAQFIpAICuKLBMouqwSJEUwiiJQFIGAwAwC4S7chbtwF/zvs3Pf37zfcz/352aY8X27+919u/v2vd/JmdmH0NHR8fGboC4N1KVZvbDL31yomaMgCvIvkPvL4hzYJ4DSDjhEFlrl/XYDzQp9VSSOj2P/q4EwSZwg9EmPY0I7jslsQIHIMAE6XIhSqeRfEVzsx24GxTZtQM54IzwQj97b2+tmoVCwzs5Ob8SJxkIMaJgpAZ9qAAKkohpGzHd3dxt4fHxsRJh1dXV5E/DEAznRgWzJpIFmTgWFPnQKDA0N2cvLi0Jc9vX12f7+vr29vXlzmgh7APuQwDfUF28gJOpc8gcfQ87Ly0s7PDyU6XJqasoWFxddp7menh5vhGuamZlJGgtzegO+I1oURNdycSKAj2IHBwe2trYmt+3t7SU6yv39vdEEk1leXoayk5MTvyZyQHz6JcQh8LDGx8eNEwwPD3sy7hnUajUDExMT5MnE7e2tXV1d2cDAgMdMT08b10duDpdMQEWJQqco+tnZmW8gCcV4dJyMU3EN2MS1wsjISBLCvouLC78Sb4CC8qIz5jDx5uamu4+OjlyynJ+fI3zsJHMjY7m5ubHBwcGUd3t722ZnZ80bwENhflD6+/t91Nzx0tISLpufn3eZtczNzWW5nGfcCwsLRk4eI/L9/d2YpDdAcUa+sbFh3BmO6+trOz099QTtLhyA/Bzw9fXVKJ7P5/0N+SOkQ0a+u7vbbi3jENVq1e7u7lK5OGSlUjF85XLZfTziHAsPCobRIIWtrS2pmfL5+dm4KkbLI2Vqk5OTNjY25nc8Ojrqe3nEFKcehKRfAQbfK6NZX1+3nZ0dYuzh4SG5NyeCRafQ4+KE5OGUgLf09PRkjB29WCz6yIkBSpU0AEFSXjrAPj4+9gRcEfbq6irCwTeMwgQ4NZ8WkyQ5eTitgA0P2BPCG4CQE6mu1blOxDshdmVlxXjV6JoAOg+MoujkiQEfw9+ASG2gYwEfSQEF+EXjC+G68Anw7FEO8djSY4nPJ4ASOrEBHFKgAOA+mRJ+EBbHFtgnPZTwAM4bQBGBLsAB2UhsQCMU5pWjw+EH6AA9RswnDRAYO+EAvIANsJkE//vRxUnHDgEPQg491QAEQQC9GfBlIY4P42Kf7E8NyKHNsltJxYey1R78mQ3gBGHCr3Rif4LUZ/iTBO3u8QlwsnYTZe1vxf8DAAD//wp+tRYAAAAGSURBVAMAn09oAfKkgVgAAAAASUVORK5CYII='
  },

  burningShip: {
    name: 'Burning Ship',
    fn: (x: number, y: number, p1: number = 2, p2: number = 2): number => {
      let zx = 0;
      let zy = 0;
      let iter = 0;

      while (iter < ITERATIONS) {
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
    },
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADfUlEQVR4AaSWrU8DQRDFJ01AgAABBgEGAwkIMBgMBgQKDAIsCDwGDQISMCBAYECA549AoDAgQLSiFa1oRStaAf1teJe9614/rk1eZ3Z2Pt7O7u1dbmRk5HcYjI2N/faDtBo5y/BrJzOh33D5I/2YgQgQDPwEWfR2xwwQ2xcBigIChgE5ADnm5uZsfX3dehJQAEFZQQ6geHQ68PHx0Z0AjgrKKpM5GI+Pj7t0o6Oj6QRwdF5D/CVzMKbo0tKStVotm5qaChPAMa0uc92guJBPpVKxh4cHOzs7c4ew0Wh0EiBQSSSxAfaN9k1OTmqqQ+IHFhYWDF9WjD/Fcd7a2rLz83P3GM/OzsYJEIiTwBgwllxZWbHDw0M7Pj52SbADip2enhrF0FlpPp+3YrFo39/fpIiArVAo2M/PT5yAPEgINEaSdHp62q2KhDxGy8vLxspICE5OTkxFFxcXCevA/v6+UZz2cw6ix1AFJf1IbGB1ddXt3d3dnR0dHVmpVHJutNkpPf4uLi7s8/PTHcBms2kgIkAsRZBJUGBtbc0mJiZsfn7eGONDMmS/eHp6ch2Tf9QBCgNNhCTFbm9vjX0Ozfey7ezsmNrOyuUf64CMvoTY+/u7PT4++uaBdc4NK1ZxdJI4AhRhEALtnpmZsbRDFYpJ2ra3t6PVJ+f4Hkja3BhSnHrk8/Ozs2X947BqxeTw9RgBigEeuevra/f88ljt7e0RlwncGew9wWo/uhBtAYUx0nL0g4MDhkOD+4EVg1CyWAdU/OrqKuSbyVar1brG5SgKOGg859z3u7u7XYMGmUxbuXJEW4Aje4XksuGa3djYcHe+nLPIt7e3WBj5fUOuXq8bKJfLTlarVau2wR3/9fVlr6+v7vbj7QYprmM+pZDcjpubm3Zzc+Pn7NDpaofx35CDUQiQ4tQi6Qx7CSkeKV4m6IA32v39vfu+4z3/nzcm+PSKGbyB2wIIeLZIxQ4gARmBMXaIAchB7OXlxdi2KEEPhRyOAH4MkGlgXsBHZJDYRYTusD18D+AH2D5kCG4LNEEioHGaxEfABxJANjpyeXlpEKE45PALIeqAP6lESN8e0n0fkaAgJDgj6GyZ5pRDcUECckLiKDAOwZ+nkEBhEIqRzREggQzdJH5CyI+5kB2bP+frjgAOg4IkIBmHLQT5MScdGRFITjDZD3rF+TlCvn8AAAD///QfzssAAAAGSURBVAMA+7Y9aA9X2b4AAAAASUVORK5CYII='
  },

  newton: {
    name: 'Newton (Root-Finding)',
    fn: (x: number, y: number, p1: number = 3, p2: number = 1): number => {
      const tolerance = 1e-6;
      let zx = x;
      let zy = y;
      let iter = 0;

      while (iter < ITERATIONS) {
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
    },
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADcUlEQVR4AdTWPS9tQRQG4MlNKCgoKCiQoFFQUGv8Yz9BpdBQUIgEBQUFBQXFveeZ5D0ZZ2/HoZGbeM9as2Z9vLPmw/5TSvn7m0BgUP/3/v5/Ag8PDwX08OXlhfgWJu7A3d1deXp6KpeXlxXX19flegBFgY4IeXJyUt7e3iYiMhGBFFdgamqqwPT0dAlmZ2cLZLy8vFweHx8LImLGMfmSwOnpaV25oqCIYjMzMyVgB2MyWF1drbV1rio9P2MJHB0d1RCJFZ2fny9zc3MV9FHwgxCIfH9/H56TmrD56SVwfn5eDg8Pa6slVFxhBem60OQYquzmFR4aB4ox9G1HL4HX19dBWKkrlTAkqvGHPwjAaHgvAS2zWrByJEYDx42t9OzsrLZdrvgikG2NrUNA+00q/JOVu6biV1ZWiHJxcVFaEru7u9Wenw6BOIdAHCeR3gCrdBaAvrS0VG5ubkq2lS2LlLNDgAMSP2l7ikgcyAceq9g2Njaill4CEgmyiqHnJ4oXzz23Si7Is0HGct3f3w+3os3bISAoSJKMW2nOqpAFhSPpQWKen5+HBNhsF9khgK39NzkKRUHhFFDUWJzn1zhzkfLIadyunr1DgNHp5wwKBsajMCcGEEEA+LFB9NY3tg8EcoVaAhzHQQHQAe+GsxACkeblIEfxgcDm5maxV5I5WJwFBhm3kh4grtUeohRPLFt7s25vb2vYBwIsroh9QiRJ2JMoOqml7HRAXBfEWYA5OrCb5wcHBwdE/zU04wGxp5IAG0RX3BjYkpxcXFwsV1dX9SlWHBn5kOAvLwmdDli9VpK6oJACgSA2sg8IiF9fX6+vn48ZrUcq/sfHx1G7HTAjiSK+bKyEDuYi6UiRgTg6maJy+L/QEkj7+XY6wChYIN1K8oqNK84XFCd1AbQ+X0bsvrDIoJeASVvgRCMjif9q9tOqgU+L1oYELCwslBxqvq75zs4OdYhPCfBQ3CrIvb29ekWdC8Va8FWQBLriW1tb9WOVzVlwzektxhLgqDgSdKuR2JNrW9qOIMRHcS1fW1szrPDuZ0urofn5kgDfkEDEA4KIs2GsI3wU0F6rHr1uLRm+LSYiIEBSRLa3t4suSKrY/v5+Ubg95e69/eYvdhwmJpAkiDigxlrriQV7zAZ8+vbb3Ci+TaBNoAtWDragnYv+lfwHAAD//+wDVg0AAAAGSURBVAMAbQiZP2fYCWYAAAAASUVORK5CYII='
  },

  strangeAttractor: {
    name: 'Strange Attractors (Orbit)',
    fn: (x: number, y: number, p1: number = 1.4, p2: number = 0.3): number => {
      let zx = 0.1;
      let zy = 0.1;
      let count = 0;

      for (let i = 0; i < ITERATIONS; i++) {
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
    },
    icon: ''
  }
};
