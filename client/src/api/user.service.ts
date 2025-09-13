import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import type { User } from './types';
import { UserStorage } from './user.storage';
import { API_URL } from './const';
import { MessageService } from '~/app/components/message/message.service';
import { errorToMessage } from './api-message';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userStorage = new UserStorage();
  private messageService = inject(MessageService)
  private userSignal = signal<User | undefined>(this.userStorage.user);
  private http = inject(HttpClient);

  public user = this.userSignal.asReadonly();
  public isAuthenticated = computed(() => this.user() !== undefined);

  public requestLogin(body: { login: string, password: string }) {
    return this.http.post<User>(`${API_URL}/user/login`, body).pipe(
      tap(user => {
        this.updateAndStoreUser(user)
        this.messageService.show('Authorization successful')
      }),
      catchError(error => {
        this.messageService.show(errorToMessage(error), 'error')
        throw error;
      })
    );
  }

  public requestUpdate(id: string, body: Partial<User>) {
    const token = this.user()?.accessToken;
    return this.http.patch<User>(`${API_URL}/user/${id}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(user => {
        this.updateAndStoreUser(user)
        this.messageService.show('User update successful')
      }),
      catchError(error => {
        this.messageService.show(errorToMessage(error), 'error')
        throw error;
      })
    );
  }

  public requestUser(): void {
    const token = this.user()?.accessToken;

    this.http.get<User>(`${API_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(user => this.updateAndStoreUser(user)),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.error?.error.includes('Token expired')) {
          console.log('Token expired. Refreshing...');
          return this.refreshTokens().pipe(
            tap(() => this.retryUserRequest())
          );
        }
        throw error;
      })
    ).subscribe();
  }

  private refreshTokens() {
    const refreshToken = this.user()?.refreshToken;
    if (!refreshToken) {
      const error = new Error('No refresh token available')
      this.messageService.show(errorToMessage(error), 'error')
      throw error;
    }

    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${API_URL}/user/refresh`,
      { refreshToken }
    ).pipe(
      tap(data => this.updateAndStoreUser(data))
    );
  }

  private retryUserRequest(): void {
    const token = this.user()?.accessToken;

    this.http.get<User>(`${API_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(user => this.updateAndStoreUser(user)),
      catchError(error => {
        console.error('Failed to fetch user after token refresh:', error);
        this.messageService.show('Failed to fetch user after token refresh', 'error')
        return of();
      })
    ).subscribe();
  }

  private updateAndStoreUser(userData: Partial<User>): void {
    const currentUser = this.user();
    const updatedUser = currentUser ? { ...currentUser, ...userData } : userData as User;

    this.userSignal.set(updatedUser);
    this.userStorage.user = updatedUser;
  }
}
