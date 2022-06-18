const express = require("express");
const serverless = require("serverless-http");
const createResponse = require("./create-response.js");
const { pick } = require("ramda");

const app = express();
const router = express.Router();

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

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.get('/test',(req,res) => {
    res.json({
        hello: "test!"
      });

})

router.post('/testpost',(req,res) => {
    res.json({
        hello: "hit the POST!"
      });
})

server.post("/webhook", (req, res) => {
  try {
    res.json(createResponse.get_response(req.body));
  } catch (err) {
    console.log("Ошибка ", err);
    res.status(500).send(err);
  }
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);