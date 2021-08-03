import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IProduct } from 'src/app/types/product';
import { catchError } from 'rxjs/operators';
import { ProductsService } from 'src/app/services/products.service';

@Injectable({
    providedIn: 'root'
})
export class ProductResolver implements Resolve<IProduct> {
    constructor(
        private productService: ProductsService,
        private router: Router
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {

        return this.productService.getProductById(route.params['id'])
            .pipe(catchError((err) => this.router.navigateByUrl('/')));

    }
}