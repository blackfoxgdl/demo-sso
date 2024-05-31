const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((err) => {
      console.log('Unable to connect to MongoDB Atlas!');
      console.log('err: ', err);
    });
}

module.exports = dbConnect;
