const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  email: String,
  password: String, 
});

const Usermodel = mongoose.model("users", Userschema);

module.exports=Usermodel;
