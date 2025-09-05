import { Routes } from '@angular/router';
import { PageHome } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  { path: 'home', component: PageHome },
];
