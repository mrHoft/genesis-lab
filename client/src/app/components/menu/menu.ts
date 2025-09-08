import { Component, inject, signal, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit, OnDestroy {
  protected menuOpen = signal(false)
  private router = inject(Router);

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

  protected menu = [
    {
      id: 'login',
      title: 'Log in',
      icon: './assets/login.svg',
      action: () => this.router.navigate(['/login'])
    },
    {
      id: 'logout',
      title: 'Log out',
      icon: './assets/logout.svg',
      action: () => undefined
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: './assets/user.svg',
      action: () => this.router.navigate(['/profile'])
    }
  ]
}
