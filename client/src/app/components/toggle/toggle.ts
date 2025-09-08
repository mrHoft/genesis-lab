import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss'
})
export class Toggle {
  public checked = input.required<boolean>()
  public onChange = output<boolean>()

  public onToggle(event: Event) {
    const el = event.target as HTMLInputElement
    this.onChange.emit(el.checked)
  }
}
