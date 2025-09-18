import { Component, computed, signal } from '@angular/core';
import Storage from '~/api/storage';

type TTheme = 'dark' | 'light'

@Component({
  selector: 'app-theme',
  imports: [],
  templateUrl: './theme.html',
  styleUrl: './theme.css'
})
export class Theme {
  private storage = new Storage()
  protected theme = signal<TTheme>('dark')
  protected checked = computed(() => this.theme() === 'dark')

  constructor() {
    const theme = this.storage.get<TTheme>('theme')
    if (theme) {
      document.documentElement.className = `theme-${theme}`;
      this.theme.set(theme)
    } else {
      this.theme.set(this.getSystemColorScheme())
    }
  }

  private getSystemColorScheme(): TTheme {
    const dark = typeof globalThis.window === 'object'
      && globalThis.window.matchMedia
      && globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches;

    return dark ? 'dark' : 'light';
  }

  protected handleChange = (event: Event) => {
    const el = event.target as HTMLInputElement
    const theme = el.checked ? 'dark' : 'light'
    this.theme.set(theme)
    this.storage.set('theme', theme)
    document.documentElement.className = `theme-${theme}`;
  }
}
