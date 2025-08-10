// Password validation utilities

export interface PasswordValidation {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  strength: 'weak' | 'medium' | 'strong';
  score: number; // 0-100
}

export const validatePassword = (password: string): PasswordValidation => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const validCount = Object.values(requirements).filter(Boolean).length;
  const score = Math.min(100, (validCount / 5) * 100);
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 80) strength = 'strong';
  else if (score >= 60) strength = 'medium';

  const isValid = requirements.minLength && validCount >= 3; // At least 8 chars and 3 requirements

  return {
    isValid,
    requirements,
    strength,
    score,
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

export const getPasswordStrengthText = (strength: 'weak' | 'medium' | 'strong') => {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    default:
      return '';
  }
};
