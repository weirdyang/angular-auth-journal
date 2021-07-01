import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { avatars } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { RegisterUser } from 'src/app/types/user';
import { passwordMatchValidator } from './password-match.validator';
import { createPasswordStrengthValidator } from './password.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
// need to inject select module into root
//https://github.com/angular/angular/issues/35264
@Component({
  selector: 'dm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup
  get password() {
    return this.form.get('password');
  }
  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }
  get avatar() {
    return this.form.get('avatar')?.value;
  }
  hide = true;
  isDarkSubscription = this.themingService.darkMode$
    .subscribe(
      isDark => {
        if (isDark) {
          this.overlay.getContainerElement().classList.remove('light');
        } else {
          this.overlay.getContainerElement().classList.add('light');
        }
      }
    )
  avatars = avatars;
  user: RegisterUser = new RegisterUser();
  constructor(
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    @Optional() public dialogRef: MatDialogRef<RegisterComponent>) {


    this.form = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(6)]],
      email: [
        this.user.email, {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }],
      avatar: [this.user.avatar, Validators.required],
      password: [
        this.user.password,
        [
          Validators.required,
          Validators.minLength(8),
          createPasswordStrengthValidator()
        ],

      ],
      passwordConfirm: [
        '',
        [Validators.required, passwordMatchValidator]
      ]
    });
  }
  ngOnDestroy(): void {
    this.isDarkSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }
  save() {
    console.log(this.form.value as RegisterUser);
    this.authService.registerUser(this.form.value as RegisterUser)
      .subscribe({
        next: result => {
          this.snackBar.open(result.message, 'OK');
          this.dialogRef.close();
        },
        error: err => this.snackBar.open(err, 'OK')
      })

  }
  dismiss() {
    this.dialogRef.close();
  }
}
