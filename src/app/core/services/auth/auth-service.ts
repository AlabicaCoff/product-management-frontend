import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../models/login-model';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Variables
  private $user = new BehaviorSubject<User | null>(null);

  // Injects
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  // Functions
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, loginRequest);
  }

  logout(): void {
    localStorage.removeItem('user-username');
    localStorage.removeItem('user-roles');
    this.cookieService.delete('Authorization', '/');
    this.$user.next(null);
  }

  getUser(): User | null {
    const userName = localStorage.getItem('user-username');
    const roles = localStorage.getItem('user-roles');

    if (userName && roles?.split(',')) {
      const user: User = {
        userName: userName,
        roles: roles.split(','),
      };
      return user;
    }
    return null;
  }

  setUser(user: User): void {
    this.$user.next(user);
    localStorage.setItem('user-username', user.userName);
    localStorage.setItem('user-roles', user.roles.join(','));
  }
}
