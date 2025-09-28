import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  public version = '0.0.1'

  constructor() {
    import('~/../package.json').then(pkg => {
      this.version = pkg.version;
    }).catch(() => {
      console.warn('Failed to load package.json, using default version');
    })
  }
}
