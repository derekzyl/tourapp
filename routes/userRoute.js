/** @format */

const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUsers);
userRouter
  .route('/:id')
  .get(userController.oneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
