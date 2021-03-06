const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const createResponse = require("./create-response.js");
const { pick } = require("ramda");

// Настройка CORS
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Парсинг json
server.use(bodyParser.json());

// Парсинг запросов по типу: application/x-www-form-urlencoded
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

server.post("/webhook", (req, res) => {
  try {
    res.json(createResponse.z(req.body));
  } catch (err) {
    console.log("Ошибка ", err);
    res.status(500).send(err);
  }
});


server.listen(port, () => {
  console.log("Сервер запущен на http://localhost:" + port);
});
