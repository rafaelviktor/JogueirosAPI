const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./src/database');



app.listen(5000, () => {
    console.log("server is running on port 5000");
  });