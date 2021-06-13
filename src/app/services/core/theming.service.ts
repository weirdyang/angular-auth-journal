import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  private _darkModeSubject = new BehaviorSubject<boolean>(true);
  public darkMode$ = this._darkModeSubject.asObservable()
    .pipe(shareReplay(1));
  constructor() {

    let setting = localStorage.getItem('dark');
    if (Boolean(setting)) {
      console.log('local-storage', setting)
      this.setDarkPreference(setting === 'true');
    } else {
      const darkModeOn =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (darkModeOn) {
        this.setDarkPreference(darkModeOn)
      }
    }
  }
  setDarkPreference(setting: boolean) {
    localStorage.setItem('dark', setting.toString())
    this._darkModeSubject.next(setting);
  }

}
