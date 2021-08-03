import { FormGroup } from "@angular/forms";

export const constructFormData = function (form: FormGroup): FormData {
    const formData: FormData = new FormData();

    const { name, description, file, productType } = form.value;

    formData.append("name", name);
    formData.append("description", description);
    formData.append("productType", productType);

    if (file) {
        formData.append('file', file);
    }
    return formData;
}