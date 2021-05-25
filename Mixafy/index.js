const http = require("http");

const hostname = "127.0.0.1";
const port = process.env.PORT || 3601;


const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static("client"));

const es6Renderer = require("express-es6-template-engine");
app.engine("html", es6Renderer);
app.set("views", "client/templates");
app.set("view engine", "html");

const morgan = require("morgan");
const logger = morgan("tiny");
app.use(logger);



app.use(express.static("public/css/app.js"));

const server = http.createServer(app);

const { Mix, sequelize } = require("./models");
const db = require("./models");
const { randomBytes } = require("crypto");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/songlist", async (req, res) => {
  var mix = await Mix.findAll({
    order: sequelize.literal("artist ASC"),
  });
  console.log(mix);
  res.render("songs", {
    locals: {
      data: mix,
    },
  });
});

app.get("/playlist/Mixafy", async (req, res) => {
  var mix = await Mix.findAll({   
    order: sequelize.random(),
    limit: 20,
  });
  console.log(mix);
  res.render("playlist", {
    locals: {
      data: mix,
    },
  });
});

app.get("/playlist/:genre", async (req, res) => {
  const { genre } = req.params;
  var mix = await Mix.findAll({
    where: { genre_id: `${genre}` },
    order: sequelize.random(),
    limit: 20,
  });
  console.log(mix);
  res.render("playlist", {
        locals: {
          data: mix
      }
    });
  
});

server.listen(port, () => {
  console.log(`API running on port ${port}`);
});
