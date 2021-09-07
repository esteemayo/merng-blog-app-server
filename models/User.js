const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    passwordConfirm: String,
    passwordChangedAfter: String,
    createdAt: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('gravatar').get(function () {
  const hash = md5(this.email);
  return `https://gravatar.com/${hash}?s=200`;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return token;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAfter) {
    const changeTimestamp = parseInt(
      this.passwordChangedAfter.getTime() / 1000,
      10
    );
    return JWTTimestamp < changeTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
