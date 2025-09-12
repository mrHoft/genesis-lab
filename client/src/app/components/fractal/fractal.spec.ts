import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fractal } from './fractal';

describe('Fractal', () => {
  let component: Fractal;
  let fixture: ComponentFixture<Fractal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fractal]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Fractal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
