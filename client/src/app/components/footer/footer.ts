import { Component } from '@angular/core';
import packageJson from '~/../package.json' with { type: 'json' };

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  protected version: string

  constructor() {
    this.version = packageJson.version
  }
}
