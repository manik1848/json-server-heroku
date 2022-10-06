const mongoose = require("mongoose");

const QuesSchema = new mongoose.Schema({
  category: String,
  type: String,
  difficulty: String,
  question: String,
  answerOptions: Array,
});

const Quesmodel = mongoose.model("mockquestion", QuesSchema);

module.exports = Quesmodel;
