import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Navbar,
  ],
  providers: [UserService],
  styleUrl: './settings.scss',
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  settingsForm: FormGroup;
  isSaving = false;
  successMessage = '';
  settings_id: string = '';

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.settingsForm = this.fb.group({
      daily_point_limit: [10, [Validators.required, Validators.min(0)]],
      weekly_point_limit: [50, [Validators.required, Validators.min(0)]],
    });
  }

  async ngOnInit() {
    try {
      const savedSettings = await this._userService.getUserSettings();
      console.log('SavedSeting', savedSettings);
      if (savedSettings) {
        this.settings_id = savedSettings.settings_id;
        this.settingsForm.patchValue(savedSettings);
        this.cdr.detectChanges();
      }
    } catch (e) {
      console.error('Error fetching settings', e);
    }
  }

  async onSave(): Promise<void> {
    try {
      this.isSaving = true;
      if (this.settingsForm.valid) {
        const settingsVal = this.settingsForm.value;

        await this._userService.updateUserSettings(this.settings_id, settingsVal);
        this.successMessage = 'Settings updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      } else {
        this.settingsForm.markAllAsTouched();
      }
    } catch (error) {
      console.error('Error Updating Settings', error);
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }
}
