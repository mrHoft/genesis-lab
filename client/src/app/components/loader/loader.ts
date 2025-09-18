import { Component, computed } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    @for (delay of circles(); track $index) {
      <div class="circle" [style.animation-delay]="delay"></div>
    }
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .circle {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: currentColor;
      animation: wave 1.2s ease-in-out infinite;
    }

    @keyframes wave {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.5);
      }
    }
  `
})
export class Loader {
  protected readonly circles = computed(() => Array.from({ length: 3 }, (_, i) => `${i * 0.2}s`));
}
