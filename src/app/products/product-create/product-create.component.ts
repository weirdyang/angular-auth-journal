import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorMessage, HttpError } from 'src/app/types/http-error';

@Component({
  selector: 'dm-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  private _fileName: string = '';
  set fileName(value) {
    this._fileName = value;
  }
  get fileName() {
    return this._fileName;
  }
  validTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  accepted = this.validTypes.join();
  imagePreview: string | ArrayBuffer = '';

  form!: FormGroup;
  errorMessage: string = '';
  @ViewChild('createForm', { static: false })
  myForm!: NgForm;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(8)]],
      description: [null, [Validators.required, Validators.minLength(8)]],
      file: [null, [Validators.required]],
      productType: [null, [Validators.required, Validators.minLength(8)]],
      fileName: [null]
    })
  }

  nameError = '';
  descriptionError = '';
  fileError = '';
  productTypeError = '';

  ngOnInit(): void {

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
            fileName: file.name,
          });
          console.log(this.form.value);
          this.imagePreview = reader.result;
          this.form.get('file')?.updateValueAndValidity()
        }
      }
      reader.readAsDataURL(file);
    }
  }
  processError(error: HttpError) {
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
        const message = item as ErrorMessage;
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
  }
  submitForm() {
    console.log(this.form);
    const formData: any = new FormData();
    const { name, description, file, productType } = this.form.value;
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("productType", productType)
    console.log(formData);
    this.http.post('api/products/create', formData).subscribe(
      {
        next: () => console.log('done'),
        error: (err) => this.processError(err.error),
        complete: () => {
          this.form.reset();
          this.myForm.resetForm();
        }
      }
    );
  }
}
