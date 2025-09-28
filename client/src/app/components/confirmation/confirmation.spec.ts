import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Confirmation, TConfirmationProps, TConfirmationResult } from './confirmation';

describe('Confirmation Component', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;
  let emitSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation]
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    component = fixture.componentInstance;
    emitSpy = spyOn(component.result, 'emit');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have default title', () => {
      expect(component.title).toBe('Are you sure?');
    });

    it('should have empty default message', () => {
      expect(component.message).toBe('');
    });

    it('should render default title in the template', () => {
      const titleElement = fixture.nativeElement.querySelector('.title');
      expect(titleElement.textContent).toContain('Are you sure?');
    });
  });

  describe('Input properties', () => {
    it('should accept custom title', () => {
      component.title = 'Custom Title';
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.title');
      expect(titleElement.textContent).toContain('Custom Title');
    });

    it('should accept custom message', () => {
      component.message = 'Custom message content';
      fixture.detectChanges();

      const messageElement = fixture.nativeElement.querySelector('p');
      expect(messageElement.textContent).toContain('Custom message content');
    });
  });

  describe('Output events', () => {
    it('should emit true when Yes button is clicked', () => {
      const yesButton = fixture.nativeElement.querySelector('.button:first-child');
      yesButton.click();

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit false when Cancel button is clicked', () => {
      const cancelButton = fixture.nativeElement.querySelector('.button:last-child');
      cancelButton.click();

      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('UI elements', () => {
    it('should render both buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.button');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('Yes');
      expect(buttons[1].textContent).toContain('Cancel');
    });

    it('should render title with correct class', () => {
      const titleElement = fixture.nativeElement.querySelector('.title');
      expect(titleElement).toBeTruthy();
    });

    it('should render message paragraph', () => {
      const messageElement = fixture.nativeElement.querySelector('p');
      expect(messageElement).toBeTruthy();
    });

    it('should have buttons container with correct styling classes', () => {
      const buttonsContainer = fixture.nativeElement.querySelector('.btns');
      expect(buttonsContainer).toBeTruthy();
    });
  });

  describe('Type definitions', () => {
    it('should have correct TConfirmationProps type', () => {
      const props: TConfirmationProps = { title: 'Test', message: 'Test message' };
      expect(props.title).toBe('Test');
      expect(props.message).toBe('Test message');
    });

    it('should have correct TConfirmationResult type', () => {
      const result: TConfirmationResult = true;
      expect(result).toBe(true);

      const result2: TConfirmationResult = false;
      expect(result2).toBe(false);
    });
  });
  /*
    describe('Button interactions', () => {
      it('should call onYes method when Yes button is clicked', () => {
        spyOn(component, 'onYes');
        const yesButton = fixture.nativeElement.querySelector('.button:first-child');
        yesButton.click();
  
        expect(component.onYes).toHaveBeenCalled();
      });
  
      it('should call onCancel method when Cancel button is clicked', () => {
        spyOn(component, 'onCancel');
        const cancelButton = fixture.nativeElement.querySelector('.button:last-child');
        cancelButton.click();
  
        expect(component.onCancel).toHaveBeenCalled();
      });
    }); */
});
