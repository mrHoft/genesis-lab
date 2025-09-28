import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAbout } from './about';

describe('About', () => {
  let component: PageAbout;
  let fixture: ComponentFixture<PageAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAbout]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageAbout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
