const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
require("dotenv").config();

const { connection } = require("./config/config");
const Usermodel = require("./models/User.model");
const Blogsmodel = require("./models/Blogs.model");
const authentication = require("./middleware/authentication");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = await Usermodel.findOne({ email });
  if (!user) {
    await bcrypt.hash(password, 8, function (err, hash) {
      if (err) {
        return res.send({ Message: "Signup failed, Please try again later" });
      }
      const userData = new Usermodel({ email, password: hash });
      userData.save();
      return res.send({ Message: "signup succesful" });
    });
  } else {
    return res.send({ Message: "User already exist" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Usermodel.findOne({ email });
  const hashed_password = user.password;
  await bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      return res.send({Message:"Please try again later"});
    }
    if (result) {
      const token = jwt.sign({ email: user.email, _id: user.id }, "secret");
      if (!user) {
        res.send({Message:"Invalid credentials"});
      }
      return res.send({ Message: "Login successful", token: token });
    } else {
      res.send({Message:"Invalid credentials"});
    }
  });
});

app.get("/blogs", authentication, async (req, res) => {
  const cat = req.query.category;
  const auth = req.query.author;
  if (cat === "" && auth === "") {
    const blogs = await Blogsmodel.find();
    return res.send(blogs);
  } else if (cat !== "" && auth === "") {
    const blogs = await Blogsmodel.find({ category: cat });
    return res.send(blogs);
  } else if (cat !== "" && auth !== "") {
    const blogs = await Blogsmodel.find({
      $and: [{ category: cat }, { author: auth }],
    });
    return res.send(blogs);
  } else if (cat === "" && auth !== "") {
    const blogs = await Blogsmodel.find({ author: auth });
    return res.send(blogs);
  }
});

app.get("/myblog",authentication, async (req, res) => {
  const { userId } = req.body;
  const myblog = await Blogsmodel.find({ useId: userId });
  res.send(myblog);
});

app.delete("/myblog",authentication, async (req, res) => {
  const { id } = req.query;
  await Blogsmodel.deleteOne({ _id: id });
  const blogs = await Blogsmodel.find();
  res.send(blogs);
});

app.post("/blogs", authentication, async (req, res) => {
  const { title, category, author, content, image, userId } = req.body;

  console.log(userId);
  const blog = new Blogsmodel({
    title,
    category,
    author,
    content,
    image,
    userId,
  });
  await blog.save();
  res.send("Blog created");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
  console.log("port starting at 5000");
});
