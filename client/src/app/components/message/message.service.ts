import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export type TMessageMode = 'regular' | 'error';
export type TMessageContent = string | unknown;

interface MessageData {
  id: number;
  content: TMessageContent;
  mode: TMessageMode;
  hidden: boolean;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly _messages = signal<MessageData[]>([]);

  public show(content: TMessageContent, mode: TMessageMode = 'regular'): void {
    const id = Date.now();
    const message: MessageData = { id, content, mode, hidden: false };

    this._messages.update(msgs => [...msgs, message]);

    setTimeout(() => {
      this._messages.update(msgs =>
        msgs.map(msg => (msg.id === id ? { ...msg, hidden: true } : msg))
      );

      setTimeout(() => {
        this._messages.update(msgs => msgs.filter(msg => msg.id !== id));
      }, 500);
    }, 5000);
  }

  public get messages() {
    return this._messages.asReadonly();
  }
}
