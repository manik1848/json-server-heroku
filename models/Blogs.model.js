const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema({
  title: String,
  category:String,
  author: String,
  content:String,
  image:String,
  userId: String,
});

const Blogsmodel = mongoose.model("blogs", BlogsSchema);

module.exports = Blogsmodel;