import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { IErrorMessage, IHttpError } from 'src/app/types/http-error';

@Component({
  selector: 'dm-product-base',
  templateUrl: './product-base.component.html',
  styleUrls: ['./product-base.component.scss']
})
export class ProductBaseComponent {
  imageSrc: string | ArrayBuffer = '';

  _isSubmitting = false;

  get isSubmitting() {
    return this._isSubmitting
  }
  set isSubmitting(value) {
    this._isSubmitting = value;
  }

  _fileName: string = '';
  set fileName(value) {
    this._fileName = value;
  }
  get fileName() {
    return this._fileName;
  }

  form!: FormGroup;

  constructor(public router: Router) { }
  cancel() {
    this.router.navigateByUrl('/');
  }

  errorMessage: string = '';

  errorObject: Record<string, string> = {
    name: '',
    description: '',
    file: '',
    productType: ''
  }
  get formFile() {
    return this.form.get('file');
  }
  processErrorMessage(error: IHttpError) {
    for (const item of error.additionalInfo) {
      console.log(item);
      const message = item as IErrorMessage;
      this.errorObject[item.name] = item.error;
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
      this.processErrorMessage(error);
    }
    this.isSubmitting = false;
    return EMPTY;
  }
}
