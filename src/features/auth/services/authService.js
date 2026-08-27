// ==================== AUTH SERVICE ====================

export class AuthService {
  static validateEmail(email) {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(email.trim())
    ) {
      return "Invalid email";
    }
    return null;
  }

  static validatePassword(password) {
    if (!password) {
      return "Password is required";
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password)) {
      return "Password should have at least one uppercase, lowercase and number";
    }
    if (password.length < 8) {
      return "Password should have at least 8 characters";
    }
    return null;
  }

  static validateLoginForm(formData) {
    const errors = {};
    const emailError = this.validateEmail(formData?.email);
    if (emailError) errors.email = emailError;

    const passwordError = this.validatePassword(formData?.password);
    if (passwordError) errors.password = passwordError;

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateRegisterForm(formData) {
    const errors = {};

    if (!formData?.name || formData.name.trim() === "") {
      errors.name = "Name is required";
    }

    const emailError = this.validateEmail(formData?.email);
    if (emailError) errors.email = emailError;

    if (!formData?.phone || formData.phone.trim() === "") {
      errors.phone = "Phone is required";
    }

    if (!formData?.address || formData.address.trim() === "") {
      errors.address = "Address is required";
    }

    if (!formData?.country || formData.country.trim() === "") {
      errors.country = "Country is required";
    }

    if (!formData?.city || formData.city.trim() === "") {
      errors.city = "City is required";
    }

    if (!formData?.postcode || formData.postcode.trim() === "") {
      errors.postcode = "Postcode is required";
    }

    if (!formData?.date_of_birth || formData.date_of_birth.trim() === "") {
      errors.date_of_birth = "Date of birth is required";
    }

    if (!formData?.gender || formData.gender.trim() === "") {
      errors.gender = "Gender is required";
    }

    const passwordError = this.validatePassword(formData?.password);
    if (passwordError) errors.password = passwordError;

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateOtp(formData) {
    const errors = {};
    if (
      !formData?.digit_1 ||
      !formData?.digit_2 ||
      !formData?.digit_3 ||
      !formData?.digit_4
    ) {
      errors.digit = "Please provide full OTP";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateResetPasswordEmail(formData) {
    const errors = {};
    const emailError = this.validateEmail(formData?.email);
    if (emailError) errors.email = emailError;

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateNewPasswordForm(formData) {
    const errors = {};

    const emailError = this.validateEmail(formData?.email);
    if (emailError) errors.email = emailError;

    const passwordError = this.validatePassword(formData?.password);
    if (passwordError) errors.password = passwordError;

    if (formData?.password_confirmation !== formData?.password) {
      errors.password_confirmation = "Password does not match";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const authService = AuthService;
