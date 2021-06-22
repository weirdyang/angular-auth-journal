import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ThemingService } from '../services/core/theming.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../profile/register/register.component';
import { RegisterUser } from '../types/user';
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
export class NavBarComponent implements OnDestroy {
  menuItems: Array<MenuItem> = [{
    name: 'leaf', path: 'leaf', icon: 'leaf'
  }]
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @Input()
  darkMode!: boolean | null;

  constructor(private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private themeService: ThemingService) { }

  @Output()
  toggleDarkEvent = new EventEmitter<boolean>();

  dialogRef!: MatDialogRef<RegisterComponent, any>;
  dialogSubscription?: Subscription;

  openRegisterDialog() {
    this.dialogRef = this.dialog.open(RegisterComponent, {
      width: '450px',
      data: new RegisterUser(),
    })
    this.dialogSubscription = this.dialogRef
      .afterClosed()
      .subscribe(result => console.log('dialog closed', result))
  }
  toggleDarkMode() {
    this.toggleDarkEvent.emit(!this.darkMode);
  }
  ngOnDestroy() {
    this.dialogSubscription?.unsubscribe();
  }
}
