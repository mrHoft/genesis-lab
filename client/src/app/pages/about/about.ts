import { Component } from '@angular/core';
import packageJson from '~/../package.json' with { type: 'json' };

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class PageAbout {
  protected version = packageJson.version
}
