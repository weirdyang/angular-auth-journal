import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse, ILogin, IUser, Profile, RegisterUser } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.userApi;

  private _currentUser?: IUser;

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(value) {
    this._currentUser = value;
  }
  handleError(err: any): Observable<IApiResponse> {
    let errorMessage: string = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      console.dir(err);
      if (err.error.errors['email']) {
        errorMessage += 'Email is in use. '
      }
      if (err.error.errors['username']) {
        errorMessage += 'Username is in use.'
      }
    }
    // this.errorService.setErrorMessage("Unable to fetch records.")
    console.error(errorMessage);
    return of({ message: errorMessage, hasError: true });
  }

  loginUser(user: ILogin) {
    console.log(user);
    return this.http.post<IUser>(`${this.apiUrl}/auth/login`, user)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  registerUser(user: RegisterUser) {
    return this.http.post<IApiResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }
  constructor(private http: HttpClient) { }
}
