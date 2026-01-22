/**
 * Framework Validation Module
 * Input validation and business rule checking
 */

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'number' | 'positive' | 'custom';
  value?: unknown;
  message?: string;
  validator?: (value: unknown) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
}

export class ValidationModule {
  /**
   * Validate email format (shared utility)
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate data against rules
   */
  validate(data: Record<string, unknown> | object, rules: ValidationRule[]): ValidationResult {
    const errors: Array<{ field: string; message: string }> = [];

    for (const rule of rules) {
      const value = (data as Record<string, unknown>)[rule.field];
      const message = rule.message || `Validation failed for ${rule.field}`;

      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push({ field: rule.field, message: `${rule.field} is required` });
          }
          break;

        case 'email':
          if (value && !this.validateEmail(value as string)) {
            errors.push({ field: rule.field, message: `${rule.field} must be a valid email` });
          }
          break;

        case 'minLength':
          if (value && (value as string).length < (rule.value as number || 0)) {
            errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.value} characters` });
          }
          break;

        case 'maxLength':
          if (value && (value as string).length > (rule.value as number || 0)) {
            errors.push({ field: rule.field, message: `${rule.field} must be at most ${rule.value} characters` });
          }
          break;

        case 'number':
          if (value && isNaN(Number(value))) {
            errors.push({ field: rule.field, message: `${rule.field} must be a number` });
          }
          break;

        case 'positive':
          if (value && Number(value) <= 0) {
            errors.push({ field: rule.field, message: `${rule.field} must be positive` });
          }
          break;

        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors.push({ field: rule.field, message });
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate transaction amount
   */
  validateTransactionAmount(amount: number): ValidationResult {
    const errors: Array<{ field: string; message: string }> = [];

    if (amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    }

    if (amount > 1000000) {
      errors.push({ field: 'amount', message: 'Amount exceeds maximum transaction limit' });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate account number
   */
  validateAccountNumber(accountNumber: string): ValidationResult {
    const errors: Array<{ field: string; message: string }> = [];

    if (!/^\d{10,16}$/.test(accountNumber)) {
      errors.push({ field: 'accountNumber', message: 'Account number must be 10-16 digits' });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
