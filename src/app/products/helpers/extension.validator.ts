
import { AbstractControl, FormControl, FormGroupDirective, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { isValidImageExtension } from './image-helper';

export function createExtensionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }
        return isValidImageExtension(value)
            ? null
            : { invalidExtension: true };
    }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {

        return isValidImageExtension(control?.value);
    }
}