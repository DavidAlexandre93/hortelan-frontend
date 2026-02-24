export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export const evaluatePasswordPolicy = (password) => {
  const value = `${password || ''}`;
  const errors = [];

  if (value.length < PASSWORD_POLICY.minLength) {
    errors.push(`mínimo de ${PASSWORD_POLICY.minLength} caracteres`);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-ZÀ-Ú]/.test(value)) {
    errors.push('pelo menos uma letra maiúscula');
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-zà-ú]/.test(value)) {
    errors.push('pelo menos uma letra minúscula');
  }

  if (PASSWORD_POLICY.requireNumber && !/\d/.test(value)) {
    errors.push('pelo menos um número');
  }

  if (PASSWORD_POLICY.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>\-_[\]\\/+=~`]/.test(value)) {
    errors.push('pelo menos um caractere especial');
  }

  return {
    valid: errors.length === 0,
    errors,
    policy: PASSWORD_POLICY,
  };
};
