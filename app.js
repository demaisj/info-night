var express = require('express')
    expressLayouts = require('express-ejs-layouts');
var app = express()

app.set("view engine", "ejs");
app.use(expressLayouts);

app.get('/', function (req, res) {
  res.render("body", { title: "test123"})
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
