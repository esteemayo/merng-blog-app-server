const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { AuthenticationError } = require('apollo-server');

const User = require('../models/User');

module.exports = async (context) => {
  let token;
  const authHeader = context.req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AuthenticationError(
      'You are not logged in! Please log in to get access.'
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AuthenticationError(
      'The user belonging to this token does no longer exist.'
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new AuthenticationError(
      'User recently changed password! Please log in again.'
    );
  }

  return currentUser;
};
