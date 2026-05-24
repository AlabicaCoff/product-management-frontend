import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../../core/models/login-model';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  // Variables
  user?: User | null;

  // Injects
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  onLogout(): void {
    this.authService.logout();
  }
}