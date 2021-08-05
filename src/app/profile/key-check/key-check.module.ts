import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyCheckComponent } from './key-check.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    KeyCheckComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule
  ]
})
export class KeyCheckModule { }
