import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '~/app/utils/validation/password';
import { UserService } from '~/api/user.service';
// import { Router } from '@angular/router';
// import { i18n } from '~/data/i18n.en';

const EXAMPLE_CREDENTIALS = {
  name: 'Hobbs',
  password: 'sit'
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class PageProfile {
  // private router = inject(Router);
  private userService = inject(UserService);
  protected form: FormGroup
  protected errorMessage = signal<string | null>(null);

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', { validators: [Validators.maxLength(24)] }),
      email: new FormControl('', { validators: [Validators.email, Validators.maxLength(24)] }),
      login: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(24)] }),
      oldPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(24), passwordValidator] }),
      newPassword: new FormControl('', { validators: [Validators.maxLength(24), passwordValidator] })
    });
  }

  protected clearError() {
    this.errorMessage.set(null);
  }

  protected get validationErrors(): string[] {
    const errors: string[] = [];

    for (const [key, control] of Object.entries(this.form.controls)) {
      if (control.errors && control.touched) {
        if (control.errors['required']) errors.push(`${key} is required`);
        if (control.errors['maxlength']) errors.push(`${key} is too long`);
        if (control.errors['email']) errors.push(`${key} is wrong`);
        // Password specific errors
        if (control.errors['minlength']) errors.push(`${key} must be at least 6 characters`);
        if (control.errors['uppercase']) errors.push(`${key} must contain at least one uppercase letter`);
        if (control.errors['lowercase']) errors.push(`${key} must contain at least one lowercase letter`);
        if (control.errors['number']) errors.push(`${key} must contain at least one number`);
        if (control.errors['specialChar']) errors.push(`${key} must contain at least one special character`);
      }
    };

    return errors;
  }

  ngOnInit() {
    const user = this.userService.user()
    this.form.patchValue(user || {});
  }

  protected onSubmit() {
    const value = this.form.getRawValue();
    console.log(value)
    /*
    this.userService.login(value).subscribe({
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
    }); */
  }
}
