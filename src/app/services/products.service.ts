import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IProduct, IProductEdit } from '../types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  apiUrl = environment.productApi;
  baseUrl = `${this.apiUrl}/products`
  createProduct(formData: FormData) {
    return this.http.post(`${this.baseUrl}/create`, formData)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  updateProduct(formData: FormData, productId: string) {
    return this.http.put(`${this.baseUrl}/${productId}`, formData)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  updateProductDetails(product: IProduct, productId: string) {
    return this.http.put(`${this.baseUrl}/details/${productId}`, product)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  updateProductImage(product: FormData, productId: string) {
    return this.http.put(`${this.baseUrl}/image/${productId}`, product)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  getAllProducts() {
    return this.http.get(`${this.baseUrl}`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  getProductImage(productId: string) {
    return this.http.get(`${this.baseUrl}/image/${productId}`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  getProductById(productId: string) {
    return this.http.get<IProductEdit>(`${this.baseUrl}/details/${productId}`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  getProductsForUser() {
    return this.http.get(`${this.baseUrl}/user/self`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  getProductsByUser(userId: string) {
    return this.http.get(`${this.baseUrl}/user/${userId}`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(err);
  }
}
