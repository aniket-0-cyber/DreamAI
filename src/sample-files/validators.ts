/**
 * Validation utilities and schemas for dream data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface DreamInput {
  title?: string;
  content?: string;
  date?: string | Date;
  lucid?: boolean;
  emotions?: string[];
  clarity?: number;
}

/**
 * Base validator class
 */
export abstract class BaseValidator<T> {
  abstract validate(data: T): ValidationResult;

  protected createResult(errors: string[] = [], warnings: string[] = []): ValidationResult {
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected addError(errors: string[], field: string, message: string): void {
    errors.push(`${field}: ${message}`);
  }

  protected addWarning(warnings: string[], field: string, message: string): void {
    warnings.push(`${field}: ${message}`);
  }
}

/**
 * Dream data validator
 */
export class DreamValidator extends BaseValidator<DreamInput> {
  private readonly maxTitleLength = 100;
  private readonly maxContentLength = 5000;
  private readonly minContentLength = 10;
  private readonly validEmotions = [
    'joy', 'happiness', 'love', 'peace', 'wonder', 'satisfaction', 'creativity',
    'fear', 'anxiety', 'sadness', 'anger', 'confusion', 'frustration',
    'curiosity', 'focus', 'awareness', 'observation', 'excitement', 'calm'
  ];

  validate(data: DreamInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.validateTitle(data.title, errors, warnings);
    this.validateContent(data.content, errors, warnings);
    this.validateDate(data.date, errors, warnings);
    this.validateLucid(data.lucid, errors);
    this.validateEmotions(data.emotions, errors, warnings);
    this.validateClarity(data.clarity, errors, warnings);

    return this.createResult(errors, warnings);
  }

  private validateTitle(title: string | undefined, errors: string[], warnings: string[]): void {
    if (!title) {
      this.addError(errors, 'title', 'Title is required');
      return;
    }

    if (typeof title !== 'string') {
      this.addError(errors, 'title', 'Title must be a string');
      return;
    }

    if (title.trim().length === 0) {
      this.addError(errors, 'title', 'Title cannot be empty');
      return;
    }

    if (title.length > this.maxTitleLength) {
      this.addError(errors, 'title', `Title must be ${this.maxTitleLength} characters or less`);
    }

    if (title.length < 3) {
      this.addWarning(warnings, 'title', 'Title is very short, consider making it more descriptive');
    }
  }

  private validateContent(content: string | undefined, errors: string[], warnings: string[]): void {
    if (!content) {
      this.addError(errors, 'content', 'Content is required');
      return;
    }

    if (typeof content !== 'string') {
      this.addError(errors, 'content', 'Content must be a string');
      return;
    }

    if (content.trim().length === 0) {
      this.addError(errors, 'content', 'Content cannot be empty');
      return;
    }

    if (content.length < this.minContentLength) {
      this.addError(errors, 'content', `Content must be at least ${this.minContentLength} characters`);
    }

    if (content.length > this.maxContentLength) {
      this.addError(errors, 'content', `Content must be ${this.maxContentLength} characters or less`);
    }

    if (content.length < 50) {
      this.addWarning(warnings, 'content', 'Content is quite short, consider adding more details');
    }
  }

  private validateDate(date: string | Date | undefined, errors: string[], warnings: string[]): void {
    if (!date) {
      this.addError(errors, 'date', 'Date is required');
      return;
    }

    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      this.addError(errors, 'date', 'Date must be a valid date string or Date object');
      return;
    }

    if (isNaN(dateObj.getTime())) {
      this.addError(errors, 'date', 'Date is not valid');
      return;
    }

    const now = new Date();
    if (dateObj > now) {
      this.addError(errors, 'date', 'Date cannot be in the future');
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (dateObj < oneYearAgo) {
      this.addWarning(warnings, 'date', 'Dream is more than a year old');
    }
  }

  private validateLucid(lucid: boolean | undefined, errors: string[]): void {
    if (lucid !== undefined && typeof lucid !== 'boolean') {
      this.addError(errors, 'lucid', 'Lucid must be a boolean value');
    }
  }

  private validateEmotions(emotions: string[] | undefined, errors: string[], warnings: string[]): void {
    if (!emotions) {
      this.addWarning(warnings, 'emotions', 'No emotions specified');
      return;
    }

    if (!Array.isArray(emotions)) {
      this.addError(errors, 'emotions', 'Emotions must be an array');
      return;
    }

    if (emotions.length === 0) {
      this.addWarning(warnings, 'emotions', 'No emotions specified');
      return;
    }

    const invalidEmotions = emotions.filter(emotion => 
      typeof emotion !== 'string' || !this.validEmotions.includes(emotion.toLowerCase())
    );

    if (invalidEmotions.length > 0) {
      this.addError(errors, 'emotions', `Invalid emotions: ${invalidEmotions.join(', ')}`);
    }

    if (emotions.length > 10) {
      this.addWarning(warnings, 'emotions', 'Many emotions specified, consider focusing on the most prominent ones');
    }

    // Check for duplicates
    const uniqueEmotions = new Set(emotions.map(e => e.toLowerCase()));
    if (uniqueEmotions.size !== emotions.length) {
      this.addWarning(warnings, 'emotions', 'Duplicate emotions detected');
    }
  }

  private validateClarity(clarity: number | undefined, errors: string[], warnings: string[]): void {
    if (clarity === undefined) {
      this.addWarning(warnings, 'clarity', 'Clarity not specified');
      return;
    }

    if (typeof clarity !== 'number') {
      this.addError(errors, 'clarity', 'Clarity must be a number');
      return;
    }

    if (isNaN(clarity)) {
      this.addError(errors, 'clarity', 'Clarity cannot be NaN');
      return;
    }

    if (clarity < 1 || clarity > 10) {
      this.addError(errors, 'clarity', 'Clarity must be between 1 and 10');
      return;
    }

    if (!Number.isInteger(clarity)) {
      this.addWarning(warnings, 'clarity', 'Clarity should be a whole number');
    }

    if (clarity <= 3) {
      this.addWarning(warnings, 'clarity', 'Low clarity rating - dream might be difficult to interpret');
    }
  }
}

/**
 * Email validator
 */
export class EmailValidator extends BaseValidator<string> {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      this.addError(errors, 'email', 'Email is required');
      return this.createResult(errors);
    }

    if (typeof email !== 'string') {
      this.addError(errors, 'email', 'Email must be a string');
      return this.createResult(errors);
    }

    if (!this.emailRegex.test(email)) {
      this.addError(errors, 'email', 'Email format is invalid');
    }

    return this.createResult(errors);
  }
}

/**
 * Password validator
 */
export class PasswordValidator extends BaseValidator<string> {
  private minLength = 8;
  private requireUppercase = true;
  private requireLowercase = true;
  private requireNumbers = true;
  private requireSpecialChars = true;

  constructor(options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  }) {
    super();
    if (options) {
      Object.assign(this, options);
    }
  }

  validate(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!password) {
      this.addError(errors, 'password', 'Password is required');
      return this.createResult(errors);
    }

    if (typeof password !== 'string') {
      this.addError(errors, 'password', 'Password must be a string');
      return this.createResult(errors);
    }

    if (password.length < this.minLength) {
      this.addError(errors, 'password', `Password must be at least ${this.minLength} characters long`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      this.addError(errors, 'password', 'Password must contain at least one uppercase letter');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      this.addError(errors, 'password', 'Password must contain at least one lowercase letter');
    }

    if (this.requireNumbers && !/\d/.test(password)) {
      this.addError(errors, 'password', 'Password must contain at least one number');
    }

    if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.addError(errors, 'password', 'Password must contain at least one special character');
    }

    // Common password warnings
    if (password.toLowerCase().includes('password')) {
      this.addWarning(warnings, 'password', 'Password contains the word "password"');
    }

    if (/(.)\1{2,}/.test(password)) {
      this.addWarning(warnings, 'password', 'Password contains repeated characters');
    }

    return this.createResult(errors, warnings);
  }
}

/**
 * Utility functions for common validations
 */
export const validators = {
  /**
   * Checks if a string is not empty
   */
  isNotEmpty: (value: string): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Checks if a value is a valid number within range
   */
  isNumberInRange: (value: any, min: number, max: number): boolean => {
    return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
  },

  /**
   * Checks if an array has items
   */
  hasItems: (value: any[]): boolean => {
    return Array.isArray(value) && value.length > 0;
  },

  /**
   * Checks if a date is valid and not in the future
   */
  isValidDate: (value: any): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date <= new Date();
  },

  /**
   * Validates URL format
   */
  isValidUrl: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Creates a validation pipeline
 */
export function createValidationPipeline<T>(...validators: BaseValidator<T>[]): BaseValidator<T> {
  return new (class extends BaseValidator<T> {
    validate(data: T): ValidationResult {
      const allErrors: string[] = [];
      const allWarnings: string[] = [];

      for (const validator of validators) {
        const result = validator.validate(data);
        allErrors.push(...result.errors);
        if (result.warnings) {
          allWarnings.push(...result.warnings);
        }
      }

      return this.createResult(allErrors, allWarnings);
    }
  })();
}

// Export commonly used validators
export const dreamValidator = new DreamValidator();
export const emailValidator = new EmailValidator();
export const passwordValidator = new PasswordValidator(); 