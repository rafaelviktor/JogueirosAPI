const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./src/database');
const routes = require('./src/routes');

app.use('/', routes);

app.listen(5000, async () => {
    await sequelize.sync({ force: true });
    console.log("server is running on port 5000");
  });