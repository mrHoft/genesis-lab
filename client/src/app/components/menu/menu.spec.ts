import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '~/api/user.service';
import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;
  const routerMock = {
    navigate: jest.fn()
  };
  const userServiceMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn(),
    user: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add click listener', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      component.ngOnInit();
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('ngOnDestroy', () => {
    it('should remove click listener', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      component.ngOnDestroy();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('handleMenu', () => {
    it('should toggle menuOpen state', () => {
      component['menuOpen'].set(false);
      component.handleMenu();
      expect(component['menuOpen']()).toBe(true);
      component.handleMenu();
      expect(component['menuOpen']()).toBe(false);
    });
  });

  describe('handleLogout', () => {
    it('should call userService logout and navigate to login', () => {
      component.handleLogout();
      expect(userServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('title', () => {
    it('should return user name', () => {
      const mockUser = { name: 'Test User' };
      userServiceMock.user.mockReturnValue(mockUser);
      expect(component['title']()).toBe('Test User');
    });
  });

  describe('menu items', () => {
    it('should have correct menu structure', () => {
      expect(component['menu']).toHaveLength(5);
      expect(component['menu'][0].id).toBe('login');
      expect(component['menu'][1].id).toBe('logout');
      expect(component['menu'][2].id).toBe('profile');
      expect(component['menu'][3].id).toBe('savings');
      expect(component['menu'][4].id).toBe('404');
    });

    it('should call router navigate on menu item action', () => {
      component['menu'][0].action();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('click listener', () => {
    it('should close menu when clicking outside', () => {
      component['menuOpen'].set(true);
      const mockEvent = { target: document.createElement('div') } as unknown as MouseEvent;

      component['clickListener'](mockEvent);

      expect(component['menuOpen']()).toBe(false);
    });

    it('should not close menu when clicking menu button', () => {
      component['menuOpen'].set(true);
      const mockButton = document.createElement('button');
      const mockEvent = { target: mockButton } as unknown as MouseEvent;

      jest.spyOn(component['menuButtonRef'].nativeElement, 'contains').mockReturnValue(true);

      component['clickListener'](mockEvent);

      expect(component['menuOpen']()).toBe(true);
    });
  });
});
