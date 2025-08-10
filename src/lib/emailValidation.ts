/**
 * Email validation service using Abstract API
 * Documentation: https://docs.abstractapi.com/email-validation
 */

export interface EmailValidationResponse {
  email: string;
  autocorrect: string;
  deliverability: 'DELIVERABLE' | 'UNDELIVERABLE' | 'UNKNOWN';
  quality_score: number;
  is_valid_format: {
    value: boolean;
    text: string;
  };
  is_free_email: {
    value: boolean;
    text: string;
  };
  is_disposable_email: {
    value: boolean;
    text: string;
  };
  is_role_email: {
    value: boolean;
    text: string;
  };
  is_catchall_email: {
    value: boolean;
    text: string;
  };
  is_mx_found: {
    value: boolean;
    text: string;
  };
  is_smtp_valid: {
    value: boolean;
    text: string;
  };
}

export interface EmailValidationResult {
  isValid: boolean;
  isDeliverable: boolean;
  suggestion?: string;
  qualityScore: number;
  details: {
    validFormat: boolean;
    isFreeEmail: boolean;
    isDisposable: boolean;
    isRoleEmail: boolean;
    isCatchall: boolean;
    mxFound: boolean;
    smtpValid: boolean;
  };
  error?: string;
}

class EmailValidationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://emailvalidation.abstractapi.com/v1/';
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ABSTRACT_EMAIL_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Abstract Email API key not found in environment variables');
    }
  }
  
  /**
   * Validates an email address using Abstract API
   */
  async validateEmail(email: string, autoCorrect: boolean = true): Promise<EmailValidationResult> {
    if (!email || !this.isBasicEmailFormat(email)) {
      return {
        isValid: false,
        isDeliverable: false,
        qualityScore: 0,
        details: {
          validFormat: false,
          isFreeEmail: false,
          isDisposable: false,
          isRoleEmail: false,
          isCatchall: false,
          mxFound: false,
          smtpValid: false,
        },
        error: 'Invalid email format'
      };
    }

    if (!this.apiKey) {
      return {
        isValid: this.isBasicEmailFormat(email),
        isDeliverable: false,
        qualityScore: 0,
        details: {
          validFormat: this.isBasicEmailFormat(email),
          isFreeEmail: false,
          isDisposable: false,
          isRoleEmail: false,
          isCatchall: false,
          mxFound: false,
          smtpValid: false,
        },
        error: 'Email validation service not configured'
      };
    }

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('email', email);
      url.searchParams.append('auto_correct', autoCorrect.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data: EmailValidationResponse = await response.json();
      
      return this.processValidationResponse(data);
    } catch (error) {
      console.error('Email validation error:', error);
      return {
        isValid: false,
        isDeliverable: false,
        qualityScore: 0,
        details: {
          validFormat: this.isBasicEmailFormat(email),
          isFreeEmail: false,
          isDisposable: false,
          isRoleEmail: false,
          isCatchall: false,
          mxFound: false,
          smtpValid: false,
        },
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    }
  }

  /**
   * Processes the API response into a standardized format
   */
  private processValidationResponse(data: EmailValidationResponse): EmailValidationResult {
    const isValid = data.is_valid_format.value && data.deliverability !== 'UNDELIVERABLE';
    const isDeliverable = data.deliverability === 'DELIVERABLE';
    
    return {
      isValid,
      isDeliverable,
      suggestion: data.autocorrect || undefined,
      qualityScore: data.quality_score,
      details: {
        validFormat: data.is_valid_format.value,
        isFreeEmail: data.is_free_email.value,
        isDisposable: data.is_disposable_email.value,
        isRoleEmail: data.is_role_email.value,
        isCatchall: data.is_catchall_email.value,
        mxFound: data.is_mx_found.value,
        smtpValid: data.is_smtp_valid.value,
      }
    };
  }

  /**
   * Basic email format validation (client-side)
   */
  private isBasicEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get validation status message based on result
   */
  getValidationMessage(result: EmailValidationResult): string {
    if (result.error) {
      return result.error;
    }

    if (!result.details.validFormat) {
      return 'Please enter a valid email format';
    }

    if (result.suggestion) {
      return `Did you mean "${result.suggestion}"?`;
    }

    if (result.details.isDisposable) {
      return 'Disposable email addresses are not allowed';
    }

    if (!result.isDeliverable) {
      return 'This email address appears to be undeliverable';
    }

    if (result.details.isFreeEmail) {
      return 'Free email address detected';
    }

    if (result.isValid && result.isDeliverable) {
      return 'Valid email address';
    }

    return 'Email validation inconclusive';
  }

  /**
   * Get validation status type for UI styling
   */
  getValidationStatus(result: EmailValidationResult): 'success' | 'warning' | 'error' | 'info' {
    if (result.error || !result.details.validFormat) {
      return 'error';
    }

    if (result.suggestion) {
      return 'warning';
    }

    if (result.details.isDisposable) {
      return 'error';
    }

    if (!result.isDeliverable) {
      return 'warning';
    }

    if (result.isValid && result.isDeliverable) {
      return 'success';
    }

    return 'info';
  }
}

export const emailValidationService = new EmailValidationService();
