import { Component, inject, signal, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '~/api/user.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit, OnDestroy {
  protected menuOpen = signal(false)
  private router = inject(Router);
  private userService = inject(UserService);

  @ViewChild('menuButton', { static: true })
  private menuButtonRef!: ElementRef<HTMLElement>;

  private clickListener = (event: MouseEvent) => {
    if (this.menuButtonRef.nativeElement.contains(event.target as Node)) return
    this.menuOpen.set(false)
  }

  public ngOnInit() {
    document.addEventListener('click', this.clickListener)
  }

  public ngOnDestroy() {
    document.removeEventListener('click', this.clickListener)
  }

  protected handleMenu = () => {
    this.menuOpen.update(cur => !cur)
  }

  protected handleLogout = () => {
    this.userService.logout()
    this.router.navigate(['/login'])
  }

  protected title = () => this.userService.user()?.name

  protected menu = [
    {
      id: 'login',
      title: 'Log in',
      icon: './assets/login.svg',
      action: () => { this.router.navigate(['/login']) },
      visible: () => !this.userService.isAuthenticated()
    },
    {
      id: 'logout',
      title: 'Log out',
      icon: './assets/logout.svg',
      action: this.handleLogout,
      visible: () => this.userService.isAuthenticated()
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: './assets/user.svg',
      action: () => { this.router.navigate(['/profile']) },
      visible: () => this.userService.isAuthenticated()
    },
    {
      id: 'savings',
      title: 'Savings',
      icon: './assets/gallery.svg',
      action: () => { this.router.navigate(['/savings']) },
      visible: () => this.userService.isAuthenticated()
    },
    {
      id: '404',
      title: 'Page 404',
      icon: './assets/about.svg',
      action: () => { this.router.navigate([`/${Math.random().toString(36).slice(2, 8)}`]) },
      visible: () => true
    }
  ]
}
