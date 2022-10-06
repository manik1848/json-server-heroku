const express = require("express");
require("dotenv").config();
var cors = require("cors");

const { connection } = require("./config/config");
const Quesmodel = require("./models/Question.model");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/", async (req, res) => {
  const { category, level, ques } = req.query;
  var data = await Quesmodel.find({ category: category, difficulty: level });
  if (ques !== "") {
    data = data.slice(0, ques);
  }
  res.send(data);
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (e) {
    console.log(e);
  }
  console.log(`Port started at ${process.env.PORT}`);
});
