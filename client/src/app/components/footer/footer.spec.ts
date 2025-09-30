import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

jest.mock('~/../package.json', () => ({
  version: '1.0.0-test',
  name: 'my-app'
}), { virtual: true });

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have version from package.json', () => {
    expect(component.version).toBe('1.0.0-test');
  });
});
