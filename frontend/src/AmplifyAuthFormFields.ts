/**
 * Form fields configuration for different authentication forms.
 * @constant
 * @type {object}
 * @property {object} signIn
 * - Configuration for sign in form.
 * @property {object} signIn.username
 * - Configuration for username field in sign in form.
 * @property {boolean} signIn.username.labelHidden
 * - Whether the label for username field is hidden.
 * @property {string} signIn.username.placeholder
 * - Placeholder for username field in sign in form.
 * @property {object} signUp
 * - Configuration for sign up form.
 * @property {object} signUp.email
 * - Configuration for email field in sign up form.
 * @property {boolean} signUp.email.labelHidden
 * - Whether the label for email field is hidden.
 * @property {string} signUp.email.label
 * - Label for email field in sign up form.
 * @property {number} signUp.email.order
 *  - Order of email field in sign up form.
 * @property {object} signUp.password
 * - Configuration for password field in sign up form.
 * @property {boolean} signUp.password.labelHidden
 * - Whether the label for password field is hidden.
 * @property {string} signUp.password.label
 *  - Label for password field in sign up form.
 * @property {string} signUp.password.placeholder
 *  - Placeholder for password field in sign up form.
 * @property {boolean} signUp.password.isRequired
 * - Whether the password field is required.
 * @property {number} signUp.password.order
 * - Order of password field in sign up form.
 * @property {object} signUp.confirm_password
 * - Configuration for confirm password field in sign up form.
 * @property {boolean} signUp.confirm_password.labelHidden
 * - Whether the label for confirm password field is hidden.
 * @property {string} signUp.confirm_password.label
 * - Label for confirm password field in sign up form.
 * @property {number} signUp.confirm_password.order
 * - Order of confirm password field in sign up form.
 * @property {object} signUp.preferred_username
 * - Configuration for preferred username field in sign up form.
 * @property {boolean} signUp.preferred_username.labelHidden
 * - Whether the label for preferred username field is hidden.
 * @property {string} signUp.preferred_username.label
 * - Label for preferred username field in sign up form.
 * @property {boolean} signUp.preferred_username.isRequired
 * - Whether the preferred username field is required.
 * @property {number} signUp.preferred_username.order
 * - Order of preferred username field in sign up form.
 * @property {object} signUp.zoneinfo
 * - Configuration for zone info field in sign up form.
 * @property {boolean} signUp.zoneinfo.labelHidden
 * - Whether the label for zone info field is hidden.
 * @property {string} signUp.zoneinfo.label
 * - Label for zone info field in sign up form.
 * @property {string} signUp.zoneinfo.placeholder
 * - Placeholder for zone info field in sign up form.
 * @property {boolean} signUp.zoneinfo.isRequired
 * - Whether the zone info field is required.
 * @property {number} signUp.zoneinfo.order
 * - Order of zone info field in sign up form.
 * @property {object} forceNewPassword
 * - Configuration for force new password form.
 * @property {object} forceNewPassword.password
 * - Configuration for password field in force new password form.
 * @property {boolean} forceNewPassword.password.labelHidden
 * - Whether the label for password field is hidden.
 * @property {string} forceNewPassword.password.placeholder
 * - Placeholder for password field in force new password form.
 * @property {object} resetPassword
 * - Configuration for reset password form.
 * @property {object} resetPassword.username
 * - Configuration for username field in reset password form.
 * @property {boolean} resetPassword.username.labelHidden
 * - Whether the label for username field is hidden.
 * @property {string} resetPassword.username.placeholder
 *  - Placeholder for username field in reset password form.
 * @property {object} confirmResetPassword
 * - Configuration for confirm reset password form.
 * @property {object} confirmResetPassword.confirmation_code
 * - Configuration for confirmation code field in confirm reset password form.
 * @property {boolean} confirmResetPassword.confirmation_code.labelHidden
 * - Whether the label for confirmation code field is hidden.
 * @property {string} confirmResetPassword.confirmation_code.placeholder
 *  - Placeholder for confirmation code field in confirm reset password form.
 * @property {string} confirmResetPassword.confirmation_code.label
 *  - Label for confirmation code field in confirm reset password form.
 * @property {boolean} confirmResetPassword.confirmation_code.isRequired
 *  - Whether the confirmation code field is required.
 * @property {object} confirmResetPassword.confirm_password
 *  - Configuration for confirm password field in confirm reset password form.
 * @property {boolean} confirmResetPassword.confirm_password.labelHidden
 *  - Whether the label for confirm password field is hidden.
 * @property {string} confirmResetPassword.confirm_password.placeholder
 * - Placeholder for confirm password field in confirm reset password form.
 * @property {object} setupTOTP - Configuration for setup TOTP form.
 * @property {object} setupTOTP.QR
 * - Configuration for QR field in setup TOTP form.
 * @property {string} setupTOTP.QR.totpIssuer
 * - Issuer for TOTP QR field.
 * @property {string} setupTOTP.QR.totpUsername
 *  - Username for TOTP QR field.
 * @property {object} setupTOTP.confirmation_code
 * - Configuration for confirmation code field in setup TOTP form.
 * @property {boolean} setupTOTP.confirmation_code.labelHidden
 * - Whether the label for confirmation code field is hidden.
 * @property {string} setupTOTP.confirmation_code.label
 *  - Label for confirmation code field in setup TOTP form.
 * @property {string} setupTOTP.confirmation_code.placeholder
 * - Placeholder for confirmation code field in setup TOTP form.
 * @property {boolean} setupTOTP.confirmation_code.isRequired
 * - Whether the confirmation code field is required.
 * @property {object} confirmSignIn
 * - Configuration for confirm sign in form.
 * @property {object} confirmSignIn.confirmation_code
 * - Configuration for confirmation code field in confirm sign in form.
 * @property {boolean} confirmSignIn.confirmation_code.labelHidden
 * - Whether the label for confirmation code field is hidden.
 * @property {string} confirmSignIn.confirmation_code.label
 * - Label for confirmation code field in confirm sign in form.
 * @property {string} confirmSignIn.confirmation_code.placeholder
 * - Placeholder for confirmation code field in confirm sign in form.
 * @property {boolean} confirmSignIn.confirmation_code.isRequired
 * - Whether the confirmation code field is required.
 * @property {object} verifyContact - Configuration for verify contact form.
 * @property {object} verifyContact.contact
 *  - Configuration for contact field in verify contact form.
 * @property {boolean} verifyContact.contact.labelHidden
 *  - Whether the label for contact field is hidden.
 * @property {string} verifyContact.contact.label
 * - Label for contact field in verify contact form.
 * @property {string} verifyContact.contact.placeholder
 * - Placeholder for contact field in verify contact form.
 * @property {boolean} verifyContact.contact.isRequired
 *  - Whether the contact field is required.
 * @property {object} TOTPSetup
 *  - Configuration for TOTP setup form.
 * @property {object} TOTPSetup.code
 * - Configuration for code field in TOTP setup form.
 * @property {boolean} TOTPSetup.code.labelHidden
 * - Whether the label for code field is hidden.
 * @property {string} TOTPSetup.code.label
 * - Label for code field in TOTP setup form.
 * @property {string} TOTPSetup.code.placeholder
 *  - Placeholder for code field in TOTP setup form.
 * @property {boolean} TOTPSetup.code.isRequired
 *  - Whether the code field is required.
 * @property {object} loading
 * - Configuration for loading form.
 * @property {string} loading.spinner
 * - Spinner for loading form.
 */
export const AUTH_FORM_FIELDS = {
  signIn: {
    username: {
      labelHidden: false,
      placeholder: 'Enter your email',
    },
  },
  signUp: {
    email: {
      labelHidden: true,
      label: 'Email',
      order: 1,
    },
    password: {
      labelHidden: true,
      label: 'Password:',
      placeholder: 'Enter your Password',
      isRequired: false,
      order: 2,
    },
    confirm_password: {
      labelHidden: true,
      label: 'Confirm Password',
      order: 3,
    },
    preferred_username: {
      labelHidden: true,
      label: 'Preferred Username',
      isRequired: true,
      order: 4,
    },
    zoneinfo: {
      labelHidden: true,
      label: 'Zone info',
      placeholder: 'Enter your unique code',
      isRequired: true,
      order: 5,
    },
  },
  forceNewPassword: {
    password: {
      labelHidden: false,
      placeholder: 'Enter your Password:',
    },
  },
  resetPassword: {
    username: {
      labelHidden: false,
      placeholder: 'Enter your email:',
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      labelHidden: false,
      placeholder: 'Enter your Confirmation Code',
      label: 'Confirmation Code:',
      isRequired: false,
    },
    confirm_password: {
      labelHidden: false,
      placeholder: 'Confirm Password',
    },
  },
  setupTOTP: {
    QR: {
      totpIssuer: 'test issuer',
      totpUsername: 'amplify_qr_test_user',
    },
    confirmation_code: {
      labelHidden: false,
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      labelHidden: false,
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
};
