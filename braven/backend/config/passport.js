"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Set up default mongoose connection
var mongoDB =
  "mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/braven?retryWrites=true";
mongoose.connect(mongoDB, { useNewUrlParser: true });
var { userModel } = require("../models/models");
// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: "There is no substitute for hardwork"
  };
  passport.use(
    new JwtStrategy(opts, async function(jwt_payload, callback) {
      //
      try {
        let { email } = jwt_payload;
        //const result=await query(sql);
        let result = await userModel.findOne({ email });
        if (!result) {
          return callback("Username or password invalid", false);
        } else {
          var user = { email: result.email };
          console.log("User Verified");
          callback(null, user);
        }
      } catch (error) {
        callback("Username or password invalid", false);
      }
      //

      console.log("requiring auth");
      console.log(jwt_payload);
    })
  );
};
