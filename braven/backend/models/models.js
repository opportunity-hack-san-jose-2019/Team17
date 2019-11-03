var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  profileImage: String,
  gender: String,
  phoneNumber: String,
  city: String,
  country: String,
  school: String,
  aboutMe: String,
  hometown: String,
  languages: String,
  role: String,
  university: String,
  skills: String,
  employer: String,
  title: String,
  industry: String
});

var eventsSchema = new Schema({
  eventName: String,
  from: Date,
  to: Date,
  interviewers: [
    {
      uid: { type: Schema.Types.ObjectId, ref: "users" },
      skill: String
    }
  ],
  students: [
    {
      uid: { type: Schema.Types.ObjectId, ref: "users" },
      skill: String
    }
  ]
});

var matchesSchema = new Schema({
  eventid: { type: Schema.Types.ObjectId, ref: "events" },
  interviewer: {
    id: { type: Schema.Types.ObjectId, ref: "users" },
    feedback: String,
    comment: String
  },
  student: {
    id: { type: Schema.Types.ObjectId, ref: "users" },
    feedback: String,
    comment: String
  }
});

var skillSchema = new Schema({
  skillsArray: [{}]
});

var userModel = mongoose.model("users", userSchema);
var eventModel = mongoose.model("events", eventsSchema);
var matchModel = mongoose.model("matches", matchesSchema);
var skillModel = mongoose.model("skills", skillSchema);

module.exports = {
  userModel,
  eventModel,
  matchModel,
  skillModel
};
