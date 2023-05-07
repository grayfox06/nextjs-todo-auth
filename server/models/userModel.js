const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
    trim: true,
    maxLength: [40, 'A user name can not have more than 40 characters'],
    minLength: [2, 'A user name can not have less than 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide email in valid format.'],
    trim: true,
    maxLength: [40, 'Email can not have more than 40 characters'],
    minLength: [8, 'Email name can not have less than 8 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minLength: [6, 'A user password can not have less than 6 characters'],
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Has the password with CPU cost of 6
  this.password = await bcrypt.hash(this.password, 6);
  // Dont persist confirm password to the DB
  // this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
