import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, BehaviorSubject } from 'rxjs';
import { map, filter, debounceTime, tap, takeUntil, switchMap, catchError, share, merge } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { IHttpError, IErrorMessage } from 'src/app/types/http-error';
import { IProduct, IProductEdit } from 'src/app/types/product';
import { IUser } from 'src/app/types/user';
import { environment } from 'src/environments/environment';
import { validTypes, fileTypeValidator, fileSizeValidator, checkFileValidator, conditionalValidator } from '../helpers/file.validator';
import { isValidImageExtension } from '../helpers/image-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { constructFormData } from '../helpers/product.processor';
@Component({
  selector: 'dm-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnInit {

  private _fileName: string = '';
  imageSrc!: string;

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
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.user = this.authService.getUser() as IUser;
  }
  product!: IProductEdit;
  user!: IUser;
  apiUrl = environment.productApi;
  conditionalFileCheck = conditionalValidator(() => this.form.get('fileName')?.value,
    Validators.compose(
      [Validators.required, fileTypeValidator, fileSizeValidator],
    ) as ValidatorFn);

  private constructFormGroup(product: IProduct) {
    this.form = this.fb.group({
      name: [product.name,
      [Validators.required, Validators.minLength(8)]],
      description: [product.description, [Validators.required, Validators.minLength(8)]],
      file: ['',
        [this.conditionalFileCheck]],
      productType: [product.productType,
      [Validators.required, Validators.minLength(8)]],
      fileName: ['',
        [checkFileValidator]]
    });

    this.form.updateValueAndValidity();

  }
  cancel() {
    this.router.navigateByUrl('/');
  }
  ngOnInit(): void {

    this.route.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      ({ product }) => {
        this.product = product;
        console.log(this.product.user, this.user.id);
        if (this.product.user !== this.user.id && this.user.role !== 'admin') {
          this.router.navigateByUrl('/')
        }
        console.log(product);
        this.constructFormGroup(product as IProduct);
        this.imagePreview = `${this.apiUrl}/products/image/${this.product.id}`
      })
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
        this.processFile(reader, file);
      }

      if (isValidImageExtension(file.name)) {
        reader.readAsDataURL(file);
      } else {
        this.snackBar.open('Only .png and .jpg files are allowed', 'OK');
      }
    }
  }
  private processFile(reader: FileReader, file: File) {
    if (reader.result) {
      this.form.patchValue({
        fileName: file.name,
        file: file,
      });
      if (isValidImageExtension(file.name)) {
        this.imagePreview = reader.result;
        this.form.get('file')?.updateValueAndValidity();
        this.form.get('fileName')?.updateValueAndValidity();
      }
    }
  }

  private processErrorMessage(item: IErrorMessage) {
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
        this.processErrorMessage(item);
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
  private formSubmitSubject = new BehaviorSubject<FormData | null>(null);
  formSubmit$ = this.formSubmitSubject.asObservable()
    .pipe(
      map(value => value as FormData),
      filter(value => value !== null),
      debounceTime(500),
      tap(_ => this.isSubmitting = true),
      share(),
      takeUntil(this.destroy$)
    )

  private productSubmitSubject = new BehaviorSubject<IProduct | null>(null);
  productSubmit$ = this.productSubmitSubject.asObservable()
    .pipe(
      map(value => value as IProduct),
      filter(value => value !== null),
      debounceTime(500),
      tap(_ => this.isSubmitting = true),
      share(),
      takeUntil(this.destroy$)
    )
  private resetForm(res: any) {
    this.isSubmitting = false
    this.errorMessage = '';
    this.nameError = '';
    console.table(res);
    this.snackBar.open(res.message, 'OK');
  }
  private formSubscription = this.formSubmit$
    .pipe(
      tap(data => console.log(data, 'subscription')),
      switchMap(formData =>
        this.postFormData(formData)),
      catchError(err => this.processError(err.error)),
    ).subscribe((res) => this.resetForm(res));

  private postSubscription = this.productSubmit$
    .pipe(
      tap(data => console.log(data, 'subscription')),
      switchMap(formData =>
        this.postUpdatedProduct(formData)),
      catchError(err => this.processError(err.error)),
    ).subscribe((res) => this.resetForm(res));

  private postUpdatedProduct(prod: IProduct) {
    return this.productService.updateProductDetails(prod, this.product.id)
      .pipe(
        catchError(err => this.processError(err.error))
      );
  }
  private postFormData(formData: FormData) {
    return this.productService.updateProduct(formData, this.product.id)
      .pipe(
        catchError(err => this.processError(err.error))
      );
  };


  submitForm() {
    this.isSubmitting = true;
    const { file } = this.form.value;
    if (file) {
      const formData: FormData = constructFormData(this.form);
      this.formSubmitSubject.next(formData);
    } else {
      const updatedProduct = {
        ...this.form.value
      }
      this.productSubmitSubject.next(updatedProduct as IProduct);
    }


  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.formSubscription.unsubscribe();
    this.postSubscription.unsubscribe();
  }
}