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
  task : String,
  status: String
});

// COLLECTION - create model that refers to collection
const Item = mongoose.model("Item", itemsSchema);

// DOCUMENT - set defaults
const item_01 = new Item ({
  task: 'Check email',
  status: 'active'
});
const item_02 = new Item ({
  task: 'Pay bills',
  status: 'active'
});
const item_03 = new Item ({
  task: 'Go for run',
  status: 'active'
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

// new schema for lists - to create separate task lists
const listSchema = {
  name: String,
  items: [itemsSchema]
};
// list COLLECTION: create mongoose model - for separate task lists
const List = mongoose.model("List", listSchema);

// HOME page
app.get("/", function(req, res) {  
// fetch DOCUMENTS in COLLECTION
  Item.find({}, function(err, item_all) {
    // check for items in db -> if none, add defaults
    if (item_all.length===0) {
      Item.insertMany( defaultItems, function(err) {
        if (err) {
          console.log(err);
      } else {
          console.log("items added!");
      }
      });
      // reload hm pg with new items added
      return res.redirect("/");
    } else {  // if already items, display
      res.render("list", {listTitle: "Tasks", newListItems: item_all});
    };
  });
});

// CUSTOM LIST PAGES
app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;
  List.findOne({name: customListName}, function(err, list_exist) {
    if(!err){
      if(!list_exist){
        //console.log("List doesn't exist");
        // create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        // save new list
        list.save();
        // reload pg to show items
        res.redirect("/" + customListName);
      } else {
        // console.log("List exists!");
        // show existing list on custom pg
        res.render("list", {listTitle: list_exist.name , newListItems: list_exist.items})
      }
    } // end if
  });
    
});
// add new item
app.post("/", function(req, res) {
  // get new item entered in form
  const itemTask = req.body.newItem;
  const listName = req.body.list;
  // set up for adding to db: task name and active status (default)
  const item = new Item ({
     task: itemTask,
     status: 'active'
    });
  // check if home page (list title: 'Tasks' or custom)
  // hm pg (listName set as 'Tasks')
  if(listName === 'Tasks'){
    // same item in mongodb
    item.save();
    // redirect/refresh to show new item -> doesn't work until subsequent refresh
    res.redirect("/");
    console.log("res.redirect fired");
  } else { // custom pg
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

}); // end app.post

// delete item
app.post("/delete", function(req, res) {
  //console.log(req.body);
  // get item id from checked box
  const checkedItemId = req.body.checkDelete;
  //console.log(checkedItemId);
  // remove item based on id
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("item deleted: ",checkedItemId);
    }
  }); 
  // refresh hm pg to remove item -> doesn't work until subsequent refresh
  res.redirect("/");
});
/*
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
