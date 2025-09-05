import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import type { User } from './types';
import { UserStorage } from './user.storage';
import { API_URL } from './const';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userStorage = new UserStorage();
  private userSignal = signal<User | undefined>(this.userStorage.user);
  private http = inject(HttpClient);

  public user = this.userSignal.asReadonly();
  public isAuthenticated = computed(() => this.user() !== undefined);

  public requestUser(): void {
    const token = this.user()?.accessToken;

    this.http.get<User>(`${API_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).pipe(
      tap(user => this.updateAndStoreUser(user)),
      catchError(error => {
        if (error instanceof Error && error.message.includes('Token expired')) {
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
