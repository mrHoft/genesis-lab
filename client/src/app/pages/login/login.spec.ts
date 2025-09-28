import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLogin } from './login';

describe('Login', () => {
  let component: PageLogin;
  let fixture: ComponentFixture<PageLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLogin]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
