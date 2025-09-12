import { Routes } from '@angular/router';
import { PageLogin } from './pages/login/login';
import { PageProfile } from './pages/profile/profile';
import { PageGallery } from './pages/gallery/gallery';
import { PageGenerator } from './pages/generator/generator';
import { PageUserSavings } from './pages/savings/savings';
import { PageNotFound } from './pages/not-found/not-found';
import { PageAbout } from './pages/about/about';

export const routes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: "full" },
  { path: 'login', component: PageLogin },
  { path: 'about', component: PageAbout },
  { path: 'profile', component: PageProfile },
  { path: 'gallery', component: PageGallery },
  { path: 'savings', component: PageUserSavings },
  { path: 'generator', component: PageGenerator },
  { path: '**', component: PageNotFound }
];
