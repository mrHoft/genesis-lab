import { Routes } from '@angular/router';
import { PageHome } from './pages/home/home';
import { PageLogin } from './pages/login/login';
import { PageProfile } from './pages/profile/profile';
import { PageGallery } from './pages/gallery/gallery';
import { PageGenerator } from './pages/generator/generator';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  { path: 'home', component: PageHome },
  { path: 'login', component: PageLogin },
  { path: 'profile', component: PageProfile },
  { path: 'gallery', component: PageGallery },
  { path: 'generator', component: PageGenerator },
];
