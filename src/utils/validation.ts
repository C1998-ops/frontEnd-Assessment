export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return { isValid: false, error: 'This field is required' };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true };
  }

  const stringValue = value.toString();

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Must be at least ${rules.minLength} characters long` 
    };
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `Must be no more than ${rules.maxLength} characters long` 
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return { isValid: false, error: 'Invalid format' };
  }

  // Email validation
  if (rules.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(stringValue)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  }

  // Phone validation
  if (rules.phone) {
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = stringValue.replace(/\D/g, '');
    if (!phonePattern.test(cleanPhone) || cleanPhone.length < 10) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
};

export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>) => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const result = validateField(data[field], rules[field]);
    if (!result.isValid) {
      errors[field] = result.error!;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Common validation rules
export const validationRules = {
  required: { required: true },
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  name: { required: true, minLength: 2, maxLength: 50 },
  password: { required: true, minLength: 8, maxLength: 128 },
  url: { 
    required: true, 
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      try {
        new URL(value);
        return null;
      } catch {
        return 'Please enter a valid URL';
      }
    }
  },
  positiveNumber: {
    required: true,
    custom: (value: any) => {
      const num = Number(value);
      return isNaN(num) || num <= 0 ? 'Must be a positive number' : null;
    }
  }
};
