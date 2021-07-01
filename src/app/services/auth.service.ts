import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse, ILogin, IUser, Profile, RegisterUser } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCsrfToken() {
    return this.http.get(`${this.apiUrl}/auth/crsftoken`);
  }
  logOut() {
    return this.http.get(`${this.apiUrl}/auth/logout`)
      .pipe(
        tap(_ => this._authenticatedSubject.next(false)),
        tap(_ => this.currentUser = null)
      )
  }
  apiUrl = environment.userApi;

  private _currentUser?: IUser | null;

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(value) {
    this._currentUser = value;
  }
  private _authenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._authenticatedSubject.asObservable()
    .pipe(shareReplay(1));


  handleError(err: any): Observable<never> {
    let errorMessage: string = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      console.dir(err);
      if (err.error.errors?.email) {
        errorMessage += 'Email is in use. '
      }
      if (err.error.errors?.username) {
        errorMessage += 'Username is in use.'
      }
      if (err.error?.message) {
        errorMessage = err.error.message;
      }
    }
    return throwError(errorMessage);
  }


  loginUser(user: ILogin) {
    console.log(user);
    return this.http.post<IUser>(`${this.apiUrl}/auth/login`, user)
      .pipe(
        catchError(error => this.handleError(error)),
        tap(user => this.currentUser = user),
        tap(_ => this._authenticatedSubject.next(true))
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
