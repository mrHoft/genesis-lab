import { Component, output } from '@angular/core';

export type TConfirmationProps = { title: string, message?: string }
export type TConfirmationResult = boolean

@Component({
  selector: 'app-confirmation',
  imports: [],
  template: /* html */`
    <h3 class="title">{{ title }}</h3>
    <p>{{ message }}</p>
    <div class="btns">
      <button type="button" class="button" (click)="onYes()">Yes</button>
      <button type="button" class="button" (click)="onCancel()">Cancel</button>
    </div>
  `,
  styles: /* css */`
  .title {
    margin-top: 0;
    text-align: center;
  }
  .btns {
    display: flex;
    column-gap: 2rem;
    justify-content: center;
  }
  `
})
export class Confirmation {
  // Mutable props (TConfirmationProps)
  public title = 'Are you sure?';
  public message = '';
  public result = output<TConfirmationResult>()

  public onYes() {
    this.result.emit(true);
  }

  public onCancel() {
    this.result.emit(false);
  }
}
