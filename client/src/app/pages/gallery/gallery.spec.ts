import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGallery } from './gallery';

describe('PageGallery', () => {
  let component: PageGallery;
  let fixture: ComponentFixture<PageGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageGallery]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
