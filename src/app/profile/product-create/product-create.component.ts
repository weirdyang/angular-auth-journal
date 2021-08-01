import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage, HttpError } from 'src/app/types/http-error';

@Component({
  selector: 'dm-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  fileName = '';
  validTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  accepted = this.validTypes.join();
  imagePreview: string | ArrayBuffer = '';

  form!: FormGroup;
  errorMessage: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  nameError = '';
  descriptionError = '';
  fileError = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['My new product', [Validators.required]],
      description: ['Amazingly delicious', [Validators.required]],
      file: [null, [Validators.required]]

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
          this.form.patchValue({
            file: file
          });
          console.log(this.form.value);
          this.imagePreview = reader.result;
          this.form.get('file')?.updateValueAndValidity()
        }
      }
      reader.readAsDataURL(file);
      this.fileName = file.name;

    }
  }
  processError(error: HttpError) {
    console.log(error);
    if (error.message) {
      this.errorMessage = error.message;
    }
    if (error.additionalInfo.length) {
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
        }
      }
    }
  }
  submitForm() {
    console.log(this.form);
    const formData: any = new FormData();
    const { name, description, file } = this.form.value;
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);
    console.log(formData);
    this.http.post('api/products/create', formData).subscribe(
      {
        next: () => console.log('done'),
        error: (err) => this.processError(err.error),
        complete: () => console.log('complete')
      }
    );
  }
}
