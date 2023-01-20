/** @format */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('shutting down ');

  process.exit(1);
});
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(` DB is now  connected to \u{1F603}`);
  });

const port = 5000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(` this baby \u{1F496} is listening to  \u{1F44F} ${port}`);
});
//testing if its working

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('shutting down ');
  server.close(() => {
    process.exit(1);
  });
});
