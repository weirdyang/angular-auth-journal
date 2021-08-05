import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavBarComponent } from './nav-bar.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterModule } from '../profile/register/register.module';
import { LoginModule } from '../profile/login/login.module';
import { MatDialogModule } from '@angular/material/dialog';
import { KeyCheckModule } from '../profile/key-check/key-check.module';
@NgModule({
  declarations: [NavBarComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    MatTooltipModule,
    RegisterModule,
    LoginModule,
    KeyCheckModule
  ],
  exports: [NavBarComponent, MatButtonModule]
})
export class NavBarModule { }
