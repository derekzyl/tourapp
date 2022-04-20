/** @format */

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, ' provide a password'],
    minlength: 8,
  },
  passwoedComfirm: {
    type: String,
    required: [true, 'please comfirm your password'],
  },
});
const User = mongoose.Model('User', userSchema);

module.exports = User;
