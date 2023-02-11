//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// create mongodb database
mongoose.connect("mongodb://localhost:27017/todolistDB");
// SCHEMA
const itemsSchema = new mongoose.Schema ({
  task : String
});
// COLLECTION - create model that refers to collection
const Item = mongoose.model("Item", itemsSchema);

// DOCUMENT - set defaults
const item_01 = new Item ({
  task: 'Check email'
});
const item_02 = new Item ({
  task: 'Pay bills'
});
const item_03 = new Item ({
  task: 'Go for run'
});
// combine in array
const defaultItems = [item_01, item_02, item_03];
// INSERT to database collection
/*
Item.insertMany( defaultItems, function(err) {
  if (err) {
    console.log(err);
} else {
    console.log("items added!");
}
});
*/
// fetch DOCUMENTS in COLLECTION
/*
Item.find({}, function(err, item_all) {
  if (err) {
      console.log(err);
  } else {
      console.log("all tasks: ",item_all);
  }
});
*/

app.get("/", function(req, res) {  
// fetch DOCUMENTS in COLLECTION
Item.find({}, function(err, item_all) {
  if (err) {
      console.log(err);
  } else {
      console.log("all tasks: ",item_all);
      res.render("list", {listTitle: "Tasks", newListItems: item_all});
      }
});
  
});
/*
app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});
*/

app.listen(3600, function() {
  console.log("Server started on port 3600");
});
