import { Component } from '@angular/core';
import { Fractal } from '~/app/components/fractal/fractal';

@Component({
  selector: 'app-generator',
  imports: [Fractal],
  templateUrl: './generator.html',
  styleUrl: './generator.css'
})
export class PageGenerator { }
