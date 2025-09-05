import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '~/api/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('genesis-lab');

  constructor(private userService: UserService) {
    this.userService.requestUser()
  }
}
