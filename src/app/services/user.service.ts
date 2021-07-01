import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.userApi;
  handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Backend returned code ${err.status}: ${err.body?.error}`;
    }
    // this.errorService.setErrorMessage("Unable to fetch records.")
    return throwError(errorMessage);
  }
  getProfile(username: string) {
    return this.http.get<Profile>(`${this.apiUrl}/users/profile/${username}`)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  constructor(private http: HttpClient) { }
}
