import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '~/app/components/menu/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Menu],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header { }
