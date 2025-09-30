import { Routes } from '@angular/router';
import { GeneratorResolver } from './pages/generator/generator.resolver';
import { GalleryResolver } from './pages/gallery/gallery.resolver';
import { AuthGuard } from '~/api/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: "full" },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.PageLogin) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.PageAbout) },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.PageProfile),
    canActivate: [AuthGuard]
  },
  {
    path: 'savings',
    loadComponent: () => import('./pages/savings/savings').then(m => m.PageUserSavings),
    canActivate: [AuthGuard]
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then(m => m.PageGallery),
    resolve: { galleryFirstPage: GalleryResolver }
  },
  { path: 'generator', loadComponent: () => import('./pages/generator/generator').then(m => m.PageGenerator) },
  {
    path: 'generator/:id',
    loadComponent: () => import('./pages/generator/generator').then(m => m.PageGenerator),
    resolve: { fractalRecord: GeneratorResolver }
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.PageNotFound) }
];
