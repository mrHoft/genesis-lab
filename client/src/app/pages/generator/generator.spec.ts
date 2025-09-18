import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGenerator } from './generator';

describe('PageGenerator', () => {
  let component: PageGenerator;
  let fixture: ComponentFixture<PageGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageGenerator]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
