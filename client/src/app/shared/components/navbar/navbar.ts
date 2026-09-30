import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  user: any = null;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.user = this._authService.getItem('user');
  }

  get username(): string {
    if (!this.user) return 'User';
    return this.user.name ?? "";
  }

  onSettings(): void {
    this._router.navigateByUrl('/user/settings');
  }

  onLogout(): void {
    this._authService.logout().subscribe((res) => { });
    this._authService.clearAuthData();
    this._router.navigateByUrl('/auth');
  }
}
