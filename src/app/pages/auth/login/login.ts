import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest, LoginResponse } from '../../../core/models/login';
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
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  // Injects
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  // Functions
  onFormSubmit(): void {
    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response: LoginResponse) => {
        if (response.isLoginSuccess) {
          // Set Auth Cookie
          this.cookieService.set(
            'Authorization',
            `Bearer ${response.token}`,
            undefined,
            '/',
            undefined,
            true,
            'Strict',
          );

          // Set User
          this.authService.setUser({
            username: response.username,
            roles: response.roles,
          });

          // Redirect to Home
          this.router.navigateByUrl('/');
        } else {
          this.errorMessage = response.failureMessage ?? 'Invalid login credentials.';
        }
      },
      error: (error) => {
        if (error.status === 400 && error.error?.errors) {
          const errorList = error.error.errors[''];
          if (errorList && errorList.length > 0) {
            this.errorMessage = errorList[0];
          } else {
            this.errorMessage = 'Invalid login credentials.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      },
    });
  }
}
