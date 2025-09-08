import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import type { User } from './types';
import { UserStorage } from './user.storage';
import { API_URL } from './const';
import { MessageService } from '~/app/components/message/message.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userStorage = new UserStorage();
  private userSignal = signal<User | undefined>(this.userStorage.user);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  public user = this.userSignal.asReadonly();
  public isAuthenticated = computed(() => this.user() !== undefined);

  public requestLogin(body: { login: string, password: string }) {
    this.http.post<User>(`${API_URL}/user`, body).pipe(
      tap(user => this.updateAndStoreUser(user)),
      catchError(error => {
        throw error;
      })
    ).subscribe();
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
        const message = error instanceof HttpErrorResponse ? error.error.message : error instanceof Error ? error.message : String(error)
        this.messageService.show(message, 'error')
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
        if (error instanceof HttpErrorResponse && error.error.message.includes('Token expired')) {
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
      this.messageService.show('No refresh token available', 'error')
      throw new Error('No refresh token available');
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
        return of(undefined);
      })
    ).subscribe();
  }

  private updateAndStoreUser(userData: Partial<User>): void {
    const currentUser = this.user();
    const updatedUser = currentUser ? { ...currentUser, ...userData } : userData as User;

    this.userSignal.set(updatedUser);
    this.userStorage.user = updatedUser;

    console.log(updatedUser)
  }
}
