import { Routes } from '@angular/router';
import { PageHome } from './pages/home/home';
import { PageLogin } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  { path: 'home', component: PageHome },
  { path: 'login', component: PageLogin },
];
