import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as FormGroup;
    if (!parent) return null;
    return parent?.get('password')?.value === parent?.get('passwordConfirm')?.value ?
        null : { mismatch: true };
}