import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ThemingService } from '../services/core/theming.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../profile/register/register.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from '../profile/login/login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { KeyCheckComponent } from '../profile/key-check/key-check.component';
interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'dm-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnDestroy, OnInit {
  menuItems: Array<MenuItem> = [{
    name: 'leaf', path: 'profile/posts', icon: 'leaf'
  }]
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }
  @Input()
  darkMode!: boolean | null;

  constructor(private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router) { }

  crsfToken$ = this.authService.getCsrfToken();
  ngOnInit(): void {
  }

  @Output()
  toggleDarkEvent = new EventEmitter<boolean>();

  dialogSubscription?: Subscription;
  openKeyDialog() {
    const dialogRef = this.dialog.open(KeyCheckComponent, {
      width: '450px',
      disableClose: true
    })
    this.dialogSubscription = dialogRef
      .afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result);
          this.openRegisterDialog();
        }
      });
  }
  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '450px',
      disableClose: true,
    })
    this.dialogSubscription = dialogRef
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.snackBar.open(result, 'OK');
        }
      });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '450px',
      disableClose: true
    })
    this.dialogSubscription = dialogRef
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.snackBar.open(result, 'OK');
        }
      });
  }

  logOut() {
    this.authService.logOut().subscribe({
      next: _ => this.router.navigateByUrl('/')
    });
  }
  toggleDarkMode() {
    this.toggleDarkEvent.emit(!this.darkMode);
  }
  ngOnDestroy() {
    this.dialogSubscription?.unsubscribe();
  }
}
