import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mandelbrot } from './mandelbrot';

describe('Mandelbrot', () => {
  let component: Mandelbrot;
  let fixture: ComponentFixture<Mandelbrot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mandelbrot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mandelbrot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
