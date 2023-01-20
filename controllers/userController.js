/** @format */

const User = require('../model/userModel');

const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'route making in progress',
  });
};
exports.oneUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'route making in progress',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'route making in progress',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'route making in progress',
  });
};
