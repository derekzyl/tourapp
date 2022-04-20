/** @format */

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const AppError = require('./utils/appError');

globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello middle finger');
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `cant find ${req.originalUrl} on this server`,
  // });

  const err = new AppError(`cant find ${req.originalUrl} on this server`);

  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
