import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
  ],
  styleUrl: './login.scss',
  templateUrl: './login.html',
  providers: [AuthService],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this._authService.isLoggedIn()) {
      this._router.navigateByUrl('/user/dashboard');
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this._authService
        .loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then((res) => {
          this._router.navigateByUrl('/user/dashboard');
        })
        .catch((err) => {
          console.log('Error Logging In', err);
        });
    }
  }
}
