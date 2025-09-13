import { AbstractControl, ValidatorFn } from '@angular/forms';

export const passwordValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const errors: Record<string, unknown> = {};

  if (value.length < 6) {
    errors['minlength'] = { requiredLength: 6, actualLength: value.length };
  }

  if (!/[A-Z]/.test(value)) {
    errors['uppercase'] = true;
  }

  if (!/[a-z]/.test(value)) {
    errors['lowercase'] = true;
  }

  if (!/\d/.test(value)) {
    errors['number'] = true;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors['specialChar'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
