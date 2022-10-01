const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  name:String,
  subject: String,
  mark: Number,
  date:String,
  studentId:String
});

const Testmodel = mongoose.model("tests", TestSchema);

module.exports=Testmodel;