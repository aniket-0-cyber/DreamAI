// src/sample-files/form-validator.ts

type ValidationRule = (value: string) => string | null;

export const isRequired: ValidationRule = (value) =>
  value.trim() !== '' ? null : 'This field is required.';

export const isEmail: ValidationRule = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address.';

export const minLength = (min: number): ValidationRule => (value) =>
  value.length >= min ? null : `Must be at least ${min} characters.`;


interface FormValues {
  [field: string]: string;
}

interface FormRules {
  [field: string]: ValidationRule[];
}

interface FormErrors {
  [field: string]: string[];
}

export const validateForm = (values: FormValues, rules: FormRules): FormErrors => {
  const errors: FormErrors = {};

  for (const field in rules) {
    const value = values[field] || '';
    const fieldRules = rules[field];
    const fieldErrors: string[] = [];

    for (const rule of fieldRules) {
      const errorMessage = rule(value);
      if (errorMessage) {
        fieldErrors.push(errorMessage);
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return errors;
}; 