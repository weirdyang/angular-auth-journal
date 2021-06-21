import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { avatars } from './config';
import { ThemingService } from './services/core/theming.service';

@Component({
  selector: 'dm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dark-mode';

  darkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemingService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('assets/svg/avatars.svg'))
    avatars.forEach(name =>
      iconRegistry.
        addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${name}.svg`)))
  }

  toggleDarkMode(setting: boolean) {
    this.themeService.setDarkPreference(setting);
  }
}
