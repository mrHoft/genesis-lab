import { Component, inject } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class MessageComponent {
  private readonly messageService = inject(MessageService);
  protected readonly displayedMessages = this.messageService.messages;
}
