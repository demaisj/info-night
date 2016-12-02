var express    = require("express"),
    ejslayouts = require("express-ejs-layouts"),
    mongo      = require("mongodb").MongoClient,
    assert     = require("assert")
    colors     = require("colors");

const dbURL = "mongodb://localhost:27017/airbus";
var port    = 8080;
var app     = express()

app.set("view engine", "ejs");
app.use(ejslayouts);
app.use(express.static("public"));

app.use(function(req, res, next) {
  if (!req.url.match(/css|js|favicon|font|fonts|cdn/gi))
    console.log(`Page ${req.url.bold.green} requested at ${new Date().toLocaleTimeString().bold.blue}...`);
  next();
})

mongo.connect(dbURL, function(error, db) {
  assert.equal(null, error);
  console.log(`MongoDB is listenting on ${dbURL}`);

  app.get("/", function (req, res) {
    res.render("index", { title: "Bienvenue !", "data": "Salut !"})
  })

  app.get("/ajax/views/:page", function(req, res) {
    let page = req.params.page;
    let query = { "_id": page };

    db.collection("pages").find(query).toArray(function(error, data) {
      if (data.length === 0)
        return res.send(JSON.stringify({"error": 404}));
      res.send(JSON.stringify(data[0], null, 2));
    })
  })
})

app.listen(port, function () {
  console.log(`Server listening on port ${port.toString().yellow}!`.bold)
})
