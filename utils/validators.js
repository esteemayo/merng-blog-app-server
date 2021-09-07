module.exports.validateRegisterInput = (
  name,
  username,
  email,
  password,
  passwordConfirm
) => {
  const errors = {};

  if (name.trim() === '') {
    errors.name = 'Please tell us your name';
  }

  if (username.trim() === '') {
    errors.username = 'Please tell us your username';
  }

  if (email.trim() === '') {
    errors.email = 'Please provide your email';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)*[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  if (password === '') {
    errors.password = 'Please provide a password';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (password !== passwordConfirm) {
    errors.passwordConfirm = 'Passwords do not match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Please provide your email';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)*[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  if (password === '') {
    errors.password = 'Please provide a password';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
