/** @format */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

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

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(` this baby \u{1F496} is listening to  \u{1F44F} ${port}`);
});
  //testing if its working