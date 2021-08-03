import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductUpdateRoutingModule } from './product-update-routing.module';
import { ProductUpdateComponent } from './product-update.component';


@NgModule({
  declarations: [
    ProductUpdateComponent
  ],
  imports: [
    CommonModule,
    ProductUpdateRoutingModule
  ]
})
export class ProductUpdateModule { }
