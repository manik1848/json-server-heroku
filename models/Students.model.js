const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name:String,
  gender: String,
  age: Number,
  tests:Array
});

const Studentmodel = mongoose.model("students", StudentSchema);

module.exports=Studentmodel;