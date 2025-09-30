import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Confirmation } from './confirmation';

describe('Confirmation', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation]
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title and message', () => {
    fixture.detectChanges();
    expect(component.title).toBe('Are you sure?');
    expect(component.message).toBe('');
  });

  it('should emit true when onYes is called', () => {
    const emitSpy = jest.spyOn(component.result, 'emit');
    component.onYes();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit false when onCancel is called', () => {
    const emitSpy = jest.spyOn(component.result, 'emit');
    component.onCancel();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should allow setting custom title and message', () => {
    component.title = 'Custom Title';
    component.message = 'Custom Message';

    fixture.detectChanges();

    expect(component.title).toBe('Custom Title');
    expect(component.message).toBe('Custom Message');
  });
});
