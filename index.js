const express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var cors = require("cors");

const { connection } = require("./config/config");
const Usermodel = require("./models/User.model");
const Studentmodel = require("./models/Students.model");
const Testmodel = require("./models/Tests.model");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Homepage");
});
app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const user = await Usermodel.findOne({ email });
  if (!user) {
    bcrypt.genSalt(10, function (err, Salt) {
      bcrypt.hash(password, Salt, function (err, hash) {
        if (err) {
          return res.send({ Message: "Signup failed, Please try again later" });
        }
        const userData = new Usermodel({ email, password: hash, name });
        userData.save();
        console.log(hash);
        return res.send({ Message: "signup succesful" });
      });
    });
  } else {
    return res.send({ Message: "User already exist" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Usermodel.findOne({ email });
  if (!user) {
    return res.send({ Message: "Invalid credentials" });
  }
  const hashed_password = user.password;
  bcrypt.compare(password, hashed_password, async function (err, isMatch) {
    if (err) {
      return res.send({ Message: "Login Failed, Please try again later" });
    }
    if (isMatch) {
      // const token = jwt.sign({ email: user.email, id: user._id }, "secret");
      const userName = user.name;
      console.log(hashed_password, password);
      return res.send({ Message: "Login successful", Name: userName });
    }

    if (!isMatch) {
      return res.send({ Message: "Invalid credentials" });
    }
  });
});

app.get("/students", async (req, res) => {
  const students = await Studentmodel.find();
  let filter = req.query.gender;
  let sort = req.query.sortby;
  // let q = req.query.q;
  // const student = await Studentmodel.find({ name: `/^${q}/` });
  // res.send(student);
  if (filter === "" && sort === "") {
    const blogs = await Studentmodel.find();
    return res.send(blogs);
  } else if (filter !== "" && sort === "") {
    const blogs = await Studentmodel.find({ gender: filter });
    return res.send(blogs);
  } else if (filter !== "" && sort !== "") {
    if (sort == "asc") {
      const blogs = await Studentmodel.find({ gender: filter }).sort({
        age: 1,
      });
      return res.send(blogs);
    } else if (sort == "desc") {
      const blogs = await Studentmodel.find({ gender: filter }).sort({
        age: -1,
      });
      return res.send(blogs);
    }
  } else if (filter === "" && sort !== "") {
    if (sort == "asc") {
      const blogs = await Studentmodel.find().sort({ age: 1 });
      return res.send(blogs);
    } else if (sort == "desc") {
      const blogs = await Studentmodel.find().sort({ age: -1 });
      return res.send(blogs);
    }
  }
});

app.post("/students", async (req, res) => {
  const { name, age, gender } = req.body;
  let tests = [];
  const student = new Studentmodel({
    name,
    age,
    gender,
    tests,
  });
  await student.save();
  res.send("Student added");
});

app.get("/tests/:id", async (req, res) => {
  const { id } = req.params;
  const tests = await Testmodel.find({ studentId: id });
  return res.send({ data: tests });
});

app.post("/tests/:id", async (req, res) => {
  const { id } = req.params;
  const { name, subject, mark, date } = req.body;
  const test = new Testmodel({
    name,
    subject,
    mark,
    date,
    studentId: id,
  });
  await test.save();
  await Studentmodel.updateOne(
    { _id: id },
    {
      $push: {
        tests: {
          name,
          subject,
          mark,
          date,
          studentId: id,
        },
      },
    }
  );

  return res.send({ Message: "Test created" });
});

app.delete("/tests/:id", async (req, res) => {
  const { id } = req.params;
  const { del } = req.query;
  await Testmodel.deleteOne({ _id: del });
  const tests = await Testmodel.find({ studentId: id });
  return res.send(tests);
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
  }
  console.log("Port started at 5000");
});
