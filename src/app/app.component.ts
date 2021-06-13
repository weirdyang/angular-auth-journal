import { Component } from '@angular/core';
import { ThemingService } from './services/core/theming.service';

@Component({
  selector: 'dm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dark-mode';

  darkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemingService) {

  }

  toggleDarkMode(setting: boolean) {
    this.themeService.setDarkPreference(setting);
  }
}
