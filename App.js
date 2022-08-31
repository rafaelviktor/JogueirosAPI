const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
require('dotenv').config();

app.get("/", async (req, res) => {
  res.status(200).send("<h1>API Jogueiros</h1><h2>Versão: 31.08.2022</h2>");
})

app.use("/users", require("./src/routes/usuarios"));
app.use("/anuncios", require("./src/routes/anuncios"));
app.use("/reservas", require("./src/routes/reservas"));

mongoose.connect(process.env.MongoDB_URL, () => console.log("Conectado ao banco de dados MongoDB."));

app.listen(process.env.PORT || 5000, async () => {
    console.log("API Jogueiros iniciada: Servidor operando na porta 5000.");
  });