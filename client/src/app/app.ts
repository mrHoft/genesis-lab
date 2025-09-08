import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '~/api/user.service';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('genesis-lab');
  private userService: UserService

  constructor() {
    this.userService = new UserService()
    this.userService.requestUser()
  }
}
