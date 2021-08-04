import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { isValidImageExtension } from '../helpers/image-helper';
import { ProductsService } from 'src/app/services/products.service';
import { validTypes, fileSizeValidator, fileTypeValidator, checkFileValidator } from '../helpers/file.validator';
import { Router } from '@angular/router';
import { constructFormData } from '../helpers/product.processor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductBaseComponent } from '../product-base/product-base.component';
@Component({
  selector: 'dm-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent extends ProductBaseComponent implements OnDestroy {

  accepted = validTypes.join();


  form!: FormGroup;

  @ViewChild('createForm', { static: false })
  myForm!: NgForm;

  constructor(
    private productService: ProductsService,
    public router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder) {
    super(router);
    this.form = this.fb.group({
      name: [null,
        [Validators.required, Validators.minLength(8)]],
      description:
        [null, [Validators.required, Validators.minLength(8)]],
      file: [null,
        [Validators.required, fileTypeValidator, fileSizeValidator]],
      productType: [null,
        [Validators.required, Validators.minLength(8)]],
      fileName: [null,
        [Validators.required, checkFileValidator]]
    })
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length) {
      const reader = new FileReader();
      const file = files[0];

      reader.onload = () => {
        if (reader.result) {
          if (isValidImageExtension(file.name)) {
            this.imageSrc = reader.result;
          }
        }
      }
      this.form.patchValue({
        fileName: file.name,
        file: file,
      });
      this.form.get('file')?.updateValueAndValidity()
      this.form.get('fileName')?.updateValueAndValidity()
      if (isValidImageExtension(file.name)) {
        reader.readAsDataURL(file);
      }
    }
  }

  protected readonly destroy$ = new Subject();
  private submitSubject = new BehaviorSubject<FormData | null>(null);
  submit$ = this.submitSubject.asObservable()
    .pipe(
      map(value => value as FormData),
      filter(value => value !== null),
      debounceTime(500),
      tap(_ => this.isSubmitting = true),
      takeUntil(this.destroy$)
    )
  private resetForm(res: any) {
    this.form.reset();
    this.myForm.resetForm();
    this.isSubmitting = false
    this.errorMessage = '';
    for (const key in this.errorObject) {
      if (Object.prototype.hasOwnProperty.call(this.errorObject, key)) {
        this.errorObject[key] = '';
      }
    }
    this.snackbar.open(res.message, 'OK')
  }
  private subscription = this.submit$
    .pipe(
      tap(data => console.log(data, 'subscription')),
      switchMap(formData =>
        this.postFormData(formData)),
      catchError(err => this.processError(err.error)),
    ).subscribe((res) => this.resetForm(res));


  private postFormData(formData: FormData) {
    return this.productService.createProduct(formData)
      .pipe(
        catchError(err => this.processError(err.error))
      );
  }

  submitForm() {
    const formData: FormData = constructFormData(this.form);
    this.submitSubject.next(formData);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}