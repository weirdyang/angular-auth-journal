import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ThemingService } from '../services/core/theming.service';

@Component({
  selector: 'dm-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  darkMode$ = this
    .themeService
    .darkMode$
    .pipe(
      tap(val => this.darkModeSetting = val)
    );
  private _darkModeSetting!: boolean;

  get darkModeSetting() {
    return this._darkModeSetting;
  }

  set darkModeSetting(val) {
    this._darkModeSetting = val;
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private themeService: ThemingService) { }

  toggleDarkMode() {
    this.themeService.setDarkPreference(!this.darkModeSetting);
  }
}
