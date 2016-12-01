var express    = require("express"),
    ejslayouts = require("express-ejs-layouts"),
    mongo      = require("mongodb").MongoClient,
    assert     = require("assert")
    colors     = require("colors");

const dbURL = "mongodb://localhost:27017/airbus";
var app = express()

app.set("view engine", "ejs");
app.use(ejslayouts);
app.use(express.static("public"));

app.use(function(req, res, next) {
  if (!req.url.match(/css|js/gi))
    console.log(`Page ${req.url.bold.green} requested at ${new Date().toLocaleTimeString().bold.blue}...`);
  next();
})

mongo.connect(dbURL, function(error, db) {
  assert.equal(null, error);
  console.log(`MongoDB is listenting on ${dbURL}`);

  app.get("/", function (req, res) {
    res.render("index", { title: "Bienvenue !"})
  })

  app.get("/:page", function(req, res) {
    let page = req.params.page;

    res.render(page, { title: page }, function(error, html) {
      if (error)
        res.render("404", { title: "404 !" });
      res.send(html);
    });
  })

  app.get("/views/:page", function(req, res) {
    let page = req.params.page;
    let query = { "_id": page };

    db.collection("pages").find(query).toArray(function(error, data) {
      res.render(page, { title: page, data: data }, function(error, html) {
        if (error)
          res.render("404", { title: "404 !" });
        res.send(html);
      });
    })
  })

})

app.listen(8080, function () {
  console.log("Server listening on port 8080!")
})
