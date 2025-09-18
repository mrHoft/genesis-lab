import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUserSavings } from './savings';

describe('PageUserSavings', () => {
  let component: PageUserSavings;
  let fixture: ComponentFixture<PageUserSavings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageUserSavings]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageUserSavings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
