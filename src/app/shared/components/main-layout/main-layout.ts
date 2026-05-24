import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { UserProfile } from '../user-profile/user-profile';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, UserProfile],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
