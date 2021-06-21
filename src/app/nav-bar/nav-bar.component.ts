import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ThemingService } from '../services/core/theming.service';
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
export class NavBarComponent {
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
    private themeService: ThemingService) { }

  @Output()
  toggleDarkEvent = new EventEmitter<boolean>();

  toggleDarkMode() {
    this.toggleDarkEvent.emit(!this.darkMode);
  }
}
