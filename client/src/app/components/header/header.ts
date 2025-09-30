import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '~/app/components/menu/menu';
import { Theme } from '~/app/components/theme/theme';

interface TabData {
  id: string,
  title: string,
  link: string,
  icon: string
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, Menu, Theme],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private router = inject(Router)
  private routerSubscription: Subscription
  protected currentRoute: string
  protected tabs: TabData[] = [
    {
      id: 'gallery',
      title: 'Gallery',
      link: 'gallery',
      icon: './assets/gallery.svg'
    },
    {
      id: 'generator',
      title: 'Generator',
      link: 'generator',
      icon: './assets/create.svg'
    },
    {
      id: 'about',
      title: 'About',
      link: 'about',
      icon: './assets/about.svg'
    }
  ]

  constructor() {
    this.currentRoute = this.router.url.split('/')[1] || '';

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const route = event.urlAfterRedirects || event.url
        this.currentRoute = route.split('/')[1] || '';
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe()
  }
}
