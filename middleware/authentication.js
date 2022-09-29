const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  if (!req.headers.authentication) {
    res.send("Please login again");
  }
  const user_token = req.headers.authentication;
  jwt.verify(user_token, "secret", function (err, decoded) {
    if(err){
        res.send("Please Login again")
    }
    // console.log(decoded); 
    req.body.email=decoded.email;
    req.body.userId=decoded._id;
    console.log(req.body.userId);
    next();
  });
};

module.exports=authentication;
