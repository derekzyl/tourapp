/** @format */
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

function tokenSign(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = tokenSign(newUser._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  //   const corrected = await bcrypt.compare(password, user.password);
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('username or password is incorrect', 401));
  }
  const token = tokenSign(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
