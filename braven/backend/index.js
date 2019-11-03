var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cors = require("cors");
// var course = require("./routes/courses");
var mysql = require("mysql");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
const util = require("util");
const saltRounds = 10;
const AmazonS3URI = require("amazon-s3-uri");
//passport auth

var morgan = require("morgan");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });
var jwt = require("jsonwebtoken");

// var kafka = require("./kafka/client");
require("./config/passport")(passport);
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Set up default mongoose connection
var mongoDB =
  "mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/braven?retryWrites=true";
mongoose.connect(mongoDB, { useNewUrlParser: true });

var { userModel } = require("./models/models");

app.use(fileUpload());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_canvas",
    resave: true, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//Allow Access Control
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Cache-Control", "no-cache");
  next();
});
app.use(bodyParser.json());

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: ""
});

const idMutator = function(result) {
  let copy = JSON.parse(JSON.stringify(result));
  copy.uid = result._id;
  return copy;
};

const awsupload = function(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
//login implemented using async await

app.post("/login", async function(request, res) {
  let req = {
    body: request.body
  };
  console.log("request ", request.body);
  let { email, password } = req.body;
  email = email.toLowerCase();
  //   let result;
  let result = await userModel.findOne({ email });

  let data = null;
  if (!result) {
    console.log("Inside err");
    res.json({
      status: "error",
      message: "System Error, Try Again."
    });
    res.end();
  } else {
    const match = await bcrypt.compare(password, result.password);
    if (match) {
      var user = {
        email: result.email
      };
      var token = jwt.sign(user, "There is no substitute for hardwork", {
        expiresIn: 10080 // in seconds
      });
      data = {
        id: result._id,
        role: result.role,
        loginSuccess: 1,
        message: "Login Successfull!",
        token: "JWT " + token
      };
      //   data = {
      //     id: "result._id",
      //     role: "result.role",
      //     loginSuccess: 1,
      //     message: "Login Successfull!",
      //     token: "JWT " + "token"
      //   };
      console.log(result);
      console.log(result._id);
    } else {
      data = {
        loginSuccess: 0,
        message: "Email or Password Incorrect"
      };
    }
  }

  if (data.id) {
    res.cookie(
      "cookie",
      JSON.stringify({
        email: data.id,
        role: data.role,
        token: data.token
      }),
      { maxAge: 900000000, httpOnly: false, path: "/" }
    );
    request.session.user = data.id;
  }
  res.status(200).json(data);
});

app.post("/signup", async function(req, res) {
  //edit

  let { email, password, name, role } = req.body;
  email = email.toLowerCase();
  console.log(email + " <===email");
  try {
    let responseOne = await userModel.findOne({ email });

    if (responseOne) {
      var body = {
        message: "Signup failed! Email already exists",
        insertStatus: 0
      };
      //  res.status(200).json(body);
      res.status(200).json(body);
      res.end();
    } else {
      console.log("user ", user);
      let hash = await bcrypt.hash(password, saltRounds);
      var user = new userModel({ email, password: hash, name, role });

      let response = await user.save();
      console.log("user saved");
      console.log(response);
      var body = {
        message: "Sign up successfull. Redirecting to Login Page...",
        insertStatus: 1
      };
      console.log("Inside else");
      res.status(200).json(body);
    }
  } catch (error) {
    console.log("Inside err");
    res.json({
      status: "error",
      msg: "System Error, Try Again."
    });
    res.end();
  }
});

app.get("/getprofilebyid/:id", requireAuth, async (req, res) => {
  let { id } = req.params;
  console.log(id);
  (async () => {
    try {
      let result = await userModel.findById(id);
      let copy = idMutator(result);
      res.status(200).json([copy]);
    } catch (error) {
      console.log(error);
    }
  })();
});

app.post("/updateprofile", (req, res) => {
  let {
    uid,
    name,
    phoneNumber,
    profileImage,
    aboutMe,
    city,
    country,
    school,
    hometown,
    languages,
    gender
  } = req.body;
  console.log("body is :");
  console.log(req.body);
  //  console.log(uid);
  console.log("files is :");
  console.log(req.files.file);

  (async () => {
    try {
      // var base64data = new Buffer(req.files.file.data, 'binary');
      // console.log(base64data);
      const params = {
        Bucket: "braven",
        Key: uid,
        Body: req.files.file.data
      };
      //  s3.upload(params,function(err,data){
      //      console.log(data)
      //  });
      console.log(params);
      let ress = await awsupload(params);
      console.log(ress);

      //profileImage: req.files.file.data,
      var post = {
        profileImage: ress.Location,
        name,
        phoneNumber,
        aboutMe,
        city,
        country,
        school,
        hometown,
        languages,
        gender
      };
      //    let sql=`UPDATE Users SET name=${name}, profileImage=${req.files.file.data} WHERE uid=${uid}`;
      //    console.log(sql);
      let result = await userModel.findOneAndUpdate(
        { _id: uid },
        { $set: { ...post } }
      );
      // let sql=`UPDATE Users SET ? WHERE uid=${uid}`;
      //    await query(sql,post);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Profile Updated !" }));
    } catch (error) {
      console.log(error);
    }
  })();
});

module.exports = app;
app.listen(3001, function() {
  console.log("Server Listening on port 3001");
});