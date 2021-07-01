import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Journal } from '../types/journal';
import { IApiResponse, Profile } from '../types/user';

interface JournalResponse {
  id: string,
  journals: Journal[]
}
@Injectable({
  providedIn: 'root'
})
export class JournalService {
  post(journal: Journal) {
    return this.http.post<IApiResponse>(`${this.apiUrl}/journals/create`, journal)
      .pipe(
        catchError(error => this.handleError(error),
        )
      )
  }
  apiUrl = environment.journalApi;
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
  getAllJournals() {
    return this.http.get<JournalResponse>(`${this.apiUrl}/journals`)
      .pipe(
        catchError(error => this.handleError(error)),
        map(res => res.journals)
      );
  }

  constructor(private http: HttpClient) { }
}