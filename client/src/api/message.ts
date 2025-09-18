import { Injectable } from '@angular/core';
import { MessageService } from '~/app/components/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiMessage extends MessageService {
  public showMessage = ({ message, error }: { message?: string, error?: unknown }) => {
    if (message) {
      this.show(message)
    } else if (error) {
      const message = (() => {
        if (error instanceof HttpErrorResponse) {
          return error.error.error || error.error.message
        }
        if (error instanceof Error) {
          return error.message
        }
        return String(error)
      })()
      console.log(message)
      this.show(message, 'error')
    }
  }
}

export const errorToMessage = (error: unknown) => {
  if (error instanceof HttpErrorResponse) {
    return error.error.error || error.error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
