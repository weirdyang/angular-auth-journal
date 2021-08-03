import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductResolver } from './product-resolver.service';
import { ProductUpdateComponent } from './product-update.component';

const routes: Routes = [{
  path: ':id',
  component: ProductUpdateComponent,
  resolve: {
    product: ProductResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductUpdateRoutingModule { }
