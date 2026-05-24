import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest, LoginResponse } from '../../../core/models/login-model';
import { AuthService } from '../../../core/services/auth/auth-service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Variables
  currentYear: number = new Date().getFullYear();
  errorMessage: string = '';

  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  // Injects
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  // Functions
  onFormSubmit(): void {
    const loginRequest: LoginRequest = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response: LoginResponse) => {
        console.log(response)
        if (response.isLoginSuccess) {
          // Set Auth Cookie
          this.cookieService.set(
            'accessToken',
            `${response.token}`,
            undefined,
            '/',
            undefined,
            false, // NOTE: set to true in production (HTTPS only)
            'Strict',
          );

          // Set User
          this.authService.setUser({
            userName: response.userName,
            roles: response.roles,
          });

          // Redirect to Home
          this.router.navigateByUrl('/');
        } else {
          this.errorMessage = response.failureMessage ?? 'Invalid login credentials.';
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage =
            error.error?.failureMessage ?? 'Invalid login credentials.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      },
    });
  }
}
