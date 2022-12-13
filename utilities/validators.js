module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
  ) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username cannot not be empty';
    }
    if (email.trim() === '') {
      errors.email = 'Email cannot not be empty';
    } else {
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = 'Invalid Email address. Please re-enter the email address';
      }
    }
    if (password === '') {
      errors.password = 'Password cannot not empty';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match. Re-enter the password.';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
      };
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username cannot not be empty';
    }
    if (password.trim() === '') {
      errors.password = 'Password cannot not be empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };

