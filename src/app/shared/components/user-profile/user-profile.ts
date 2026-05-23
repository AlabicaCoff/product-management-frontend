import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  user?: LoginUser;

  constructor() {

  }

  ngOnInit(): void {
    this.user = {
      userName: "string",
      role: "admin",
    }
  }

  onLogout(): void {
  }
}

interface LoginUser {
  userName: string;
  role: string;
}