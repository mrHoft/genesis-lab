import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toggle } from './toggle';

describe('Toggle', () => {
  let component: Toggle;
  let fixture: ComponentFixture<Toggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toggle]
    }).compileComponents();

    fixture = TestBed.createComponent(Toggle);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when toggled on', () => {
    const emitSpy = jest.spyOn(component.onChange, 'emit');
    const mockEvent = {
      target: { checked: true }
    } as unknown as Event;

    component.onToggle(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit false when toggled off', () => {
    const emitSpy = jest.spyOn(component.onChange, 'emit');
    const mockEvent = {
      target: { checked: false }
    } as unknown as Event;

    component.onToggle(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
