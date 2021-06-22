import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { avatars } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { RegisterUser } from 'src/app/types/user';
import { passwordMatchValidator } from './password-match.validator';
import { createPasswordStrengthValidator } from './password.validator';
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
  constructor(
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) { username, email, avatar,
      password }: RegisterUser) {


    this.form = this.fb.group({
      username: [username, [Validators.required, Validators.minLength(6)]],
      email: [
        email, {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }],
      avatar: [avatar, Validators.required],
      password: [
        password,
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
      .subscribe(response => {
        if (response?.hasError) {
          console.error(response?.message)
        } else {
          this.dialogRef.close(response.message);
        }
      })

  }
  dismiss() {
    this.dialogRef.close();
  }
}
