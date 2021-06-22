import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterUser } from 'src/app/types/user';
// need to inject select module into root
//https://github.com/angular/angular/issues/35264
@Component({
  selector: 'dm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup
  get password() { return this.form.get('password'); }
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) { username, email, avatar,
      password }: RegisterUser) {


    this.form = fb.group({
      username: [username, Validators.required],
      email: [email, Validators.required],
      avatar: [avatar, Validators.required],
      password: [
        password,
        [
          Validators.required,
          Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
        ]
      ],
    });

  }

  ngOnInit(): void {
  }
  save() {
    this.dialogRef.close(this.form.value)
  }
  dismiss() {
    this.dialogRef.close();
  }
}
