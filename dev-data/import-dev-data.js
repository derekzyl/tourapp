/** @format */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../model/tourModel');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(` DB is now  connected to :smile: :smiley:`);
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tour-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successful created ');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successful delete');
    process.exit();
  } catch (err) { 
    console.log(err);
  }
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  importData(); 
} else if (process.argv[2] === '--delete') {
  deleteData();
}
