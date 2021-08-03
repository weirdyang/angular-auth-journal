import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject, BehaviorSubject } from 'rxjs';
import { map, filter, debounceTime, tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { ProductsService } from 'src/app/services/products.service';
import { IHttpError, IErrorMessage } from 'src/app/types/http-error';
import { IProduct } from 'src/app/types/product';
import { validTypes, fileTypeValidator, fileSizeValidator, checkFileValidator } from '../helpers/file.validator';
import { isValidImageExtension } from '../helpers/image-helper';

@Component({
  selector: 'dm-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnInit {

  private _fileName: string = '';
  set fileName(value) {
    this._fileName = value;
  }
  get fileName() {
    return this._fileName;
  }


  accepted = validTypes.join();

  imagePreview: string | ArrayBuffer = '';

  form!: FormGroup;
  errorMessage: string = '';
  @ViewChild('createForm', { static: false })
  myForm!: NgForm;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private fb: FormBuilder) {
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
  product!: IProduct;

  private productIdSubject = new BehaviorSubject<string>('');
  productId$ = this.productIdSubject.asObservable()
    .pipe(
      filter(value => value.length !== 0)
    )
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.productIdSubject.next(id);
    }
  }

  nameError = '';
  descriptionError = '';
  fileError = '';
  productTypeError = '';
  get formFile() {
    return this.form.get('file');
  }

  onFileSelected(event: Event) {

    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length) {
      const reader = new FileReader();
      const file = files[0];

      reader.onload = () => {
        if (reader.result) {
          this.form.patchValue({
            file: file,
          });
          if (isValidImageExtension(file.name)) {
            this.imagePreview = reader.result;
            this.form.get('file')?.updateValueAndValidity()
          }
        }
      }
      this.form.patchValue({
        fileName: file.name,
      });
      if (isValidImageExtension(file.name)) {
        reader.readAsDataURL(file);
      }
    }
  }
  processError(error: IHttpError) {
    console.log(error);
    if (error.message) {
      this.errorMessage = error.message;
    }
    if (error.additionalInfo) {
      console.log(error.additionalInfo);
    }
    if (error.additionalInfo && error.additionalInfo.length) {
      console.table(error.additionalInfo[0]);
      for (const item of error.additionalInfo) {
        console.log(item)
        const message = item as IErrorMessage;
        switch (message.name) {
          default:
            break;
          case 'name':
            this.nameError = message.error;
            break;
          case 'file':
            this.fileError = message.error;
            break;
          case 'description':
            this.descriptionError = message.error;
            break;
          case 'productType':
            this.productTypeError = message.error;
            break;
        }
      }
    }
    this.isSubmitting = false;
    return EMPTY;
  }
  private _isSubmitting = false;
  get isSubmitting() {
    return this._isSubmitting
  }
  set isSubmitting(value) {
    this._isSubmitting = value;
  }
  protected readonly destroy$ = new Subject();
  private submitSubject = new BehaviorSubject<FormData | null>(null);
  submit$ = this.submitSubject.asObservable()
    .pipe(
      map(value => value as FormData),
      filter(value => value !== null),
      debounceTime(500),
      tap(_ => console.log('subject')),
      tap(_ => this.isSubmitting = true),
      takeUntil(this.destroy$)
    )
  private resetForm(res: any) {
    console.log(res);
    this.form.reset();
    this.myForm.resetForm();
    this.isSubmitting = false
    this.errorMessage = '';
    this.nameError = '';
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

  private constructFormData() {
    const formData: FormData = new FormData();

    const { name, description, file, productType } = this.form.value;

    console.log(name);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("productType", productType);
    return formData;
  }
  submitForm() {
    console.log('test');
    const formData: FormData = this.constructFormData();
    console.log(formData);
    this.submitSubject.next(formData);
    console.log('after');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}