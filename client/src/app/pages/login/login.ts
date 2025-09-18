import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '~/api/user.service';
import { MessageService } from '~/app/components/message/message.service';
import { Router } from '@angular/router';
import { i18n } from '~/data/i18n.en';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class PageLogin {
  private router = inject(Router);
  private userService = inject(UserService);
  protected errorMessage = signal<string | null>(null);
  private messageService = inject(MessageService)

  protected clearError() {
    this.errorMessage.set(null);
  }

  protected form = new FormGroup({
    login: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true })
  });

  protected handleSubmit() {
    const formData = this.form.getRawValue();

    this.userService.requestLogin(formData).subscribe({
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage.set(i18n.unauthorized);
        } else {
          this.errorMessage.set(i18n.unexpected);
        }
      },
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }

  protected handleNewUser() {
    this.userService.requestNew().subscribe({
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage.set(i18n.unauthorized);
        } else {
          this.errorMessage.set(i18n.unexpected);
        }
      },
      next: () => {
        this.router.navigate(['/']);
      }
    })
  }
}
