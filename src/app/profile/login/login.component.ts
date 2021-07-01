import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { UserService } from 'src/app/services/user.service';
import { IApiResponse, ILogin, IUser } from 'src/app/types/user';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'dm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user?: ILogin;
  form!: FormGroup;
  get password() {
    return this.form.get('password');
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

  constructor(
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>) {
    this.user = {
      username: '',
      password: '',
    }
    this.form = this.fb.group({
      username: [this.user?.username, [Validators.required]],
      password: [this.user?.password, [Validators.required]]
    })
  }


  dismiss() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }
  submit() {
    this.authService.loginUser(this.form.value as ILogin)
      .subscribe({
        next: response => {
          this.dialogRef.close();
        },
        error: err => this.snackBar.open(`${err}, in error`, 'OK')
      })
  }
}

