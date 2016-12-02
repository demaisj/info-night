var express    = require("express"),
    ejslayouts = require("express-ejs-layouts"),
    mongo      = require("mongodb").MongoClient,
    assert     = require("assert"),
    path       = require("path"),
    json       = require("jsonfile"),
    colors     = require("colors");
    Plugins    = require("./Plugins.js").Plugins

const dbURL = "mongodb://salut:kk@167.114.247.210:27017/airbus";
var port    = 8080;
var app     = express()

app.set("view engine", "ejs");
app.use(ejslayouts);
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use(function(req, res, next) {
  if (!req.url.match(/css|js|favicon|font|fonts|cdn/gi))
    console.log(`Page ${req.url.bold.green} requested at ${new Date().toLocaleTimeString().bold.blue}...`);
  next();
})

mongo.connect(dbURL, function(error, db) {
  assert.equal(null, error);
  console.log(`MongoDB is listenting on ${dbURL}`);

  app.get("/", function(req, res) {
    res.redirect("/index");
  })

  app.get("/:page", function (req, res) {
      let page = req.params.page;
      let query = { "_id": page };

      db.collection("pages").findOne(query, function(error, data) {
        if (!data || data.length === 0)
          return res.render("404", {title: "Désolé, la page est introuvable."});

        let plugins = new Plugins(data.layout.modules);
        res.render("index", {title: `${page}`, css: plugins.getCss(), js: plugins.getJs(), data: data});
      })
    })

  app.get("*", function(req, res) {
    res.render("404", { title: "Désolé, page introuvable :(" });
  })
})

app.listen(port, function () {
  console.log(`Server listening on port ${port.toString().yellow}!`.bold)
})
