import { Component } from '@angular/core';
import { Mandelbrot } from 'ui/mandelbrot/mandelbrot';

@Component({
  selector: 'app-generator',
  imports: [Mandelbrot],
  templateUrl: './generator.html',
  styleUrl: './generator.css'
})
export class PageGenerator { }
