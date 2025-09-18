import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProfile } from './profile';

describe('Login', () => {
  let component: PageProfile;
  let fixture: ComponentFixture<PageProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageProfile]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
