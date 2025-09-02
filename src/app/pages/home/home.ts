import { Component } from '@angular/core';
import { Mandelbrot } from 'ui/mandelbrot/mandelbrot';

@Component({
  selector: 'app-home',
  imports: [Mandelbrot],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class PageHome {

}
