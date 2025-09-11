import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import type { GalleryRecord, GalleryResponse } from './types';
import { API_URL } from './const';
import { UserStorage } from './user.storage';
import { MessageService } from '~/app/components/message/message.service';
import { errorToMessage } from './api-message';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private userStorage = new UserStorage();
  private messageService = inject(MessageService)
  private gallerySignal = signal<GalleryRecord[]>([]);
  private http = inject(HttpClient);

  public gallery = this.gallerySignal.asReadonly();

  public add(body: Omit<GalleryRecord, 'id' | 'likes'>) {
    const token = this.userStorage.user?.accessToken;
    return this.http.post<GalleryRecord>(`${API_URL}/gallery`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(() => {
        this.messageService.show('Fractal saved successful')
      }),
      catchError(error => {
        this.messageService.show(errorToMessage(error), 'error')
        throw error;
      })
    ).subscribe();
  }

  public get(page: number, limit: number = 10, userId?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId && { user_id: userId })
    });

    return this.http.get<GalleryResponse>(`${API_URL}/gallery/?${params.toString()}`);
  }

  public like(id: string | number): void {
    const token = this.userStorage.user?.accessToken;

    this.http.post<GalleryRecord>(`${API_URL}/gallery/${id}/like`, null, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(record => {
        this.updateGallery([record])
      }),
      catchError(error => {
        this.messageService.show(errorToMessage(error), 'error')
        throw error;
      })
    ).subscribe();
  }

  private updateGallery(galleryData: GalleryRecord[]): void {
    this.gallerySignal.update(prev => {
      return prev.map(record => {
        for (const data of galleryData) {
          if (record.id === data.id) return data
        }
        return record
      })
    });
  }
}
