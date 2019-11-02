var express = require("express");
var courses = express.Router();
var mysql = require("mysql");
var multer = require("multer");
var fs = require("fs");
const AmazonS3URI = require("amazon-s3-uri");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Set up default mongoose connection
// var kafka = require("../kafka/client");
var mongoDB = "";
mongoose.connect(mongoDB, { useNewUrlParser: true });
var { userModel, courseModel } = require("../models/models");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: ""
});
//   con.connect(function(err) {
//     if (err) throw err;
//  //   console.log("MySQl Connected!");
//   });
const idMutator = function(result) {
  let copy = JSON.parse(JSON.stringify(result));
  copy.uid = result._id;
  return copy;
};
const cidMutator = function(result) {
  let copy = JSON.parse(JSON.stringify(result));
  copy.cid = result._id;
  return copy;
};
const allidMutator = function(result, oldprop, newprop) {
  let copy = JSON.parse(JSON.stringify(result));
  copy[newprop] = result[oldprop];
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
const awsdownload = function(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
// const query=function(que,obj){
//     return new Promise((resolve,reject)=>{
//         if(obj){
//          con.query(que,obj,(err,res)=>{
//             if(err){
//             reject(err);
//             }else{
//             resolve(res);
//             }
//           });
//     }else{
//         con.query(que,(err,res)=>{
//             if(err){
//               reject(err);
//             }else{
//               resolve(res);
//             }
//           });
//     }

//     });
//   }

const errorFunc = (error, res) => {
  console.log(error);
  res.writeHead(400, {
    "Content-Type": "text/plain"
  });
  console.log(error);
  res.end(error.toString());
};

function checkSession(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send("Not Authorised");
  }
}

let courseList = [
  {
    courseId: "273",
    courseName: "Enterprise Distributed System",
    courseDepartment: "CMPE",
    courseDescription: "Very nice course",
    courseRoom: "Engg 189",
    courseCapacity: 100,
    waitlistCapacity: 10,
    courseTerm: "Spring 2019",
    courseFaculty: "Mesut Ozil"
  },
  {
    courseId: "281",
    courseName: "Cloud Technologies",
    courseDepartment: "CMPE",
    courseDescription: "good course",
    courseRoom: "BBC 202",
    courseCapacity: 80,
    waitlistCapacity: 15,
    courseTerm: "Spring 2019",
    courseFaculty: "Mesut Ozil"
  },
  {
    courseId: "283",
    courseName: "Virtualization Technologies",
    courseDepartment: "CMPE",
    courseDescription: "best course",
    courseRoom: "Clark Hall 222",
    courseCapacity: 90,
    waitlistCapacity: 10,
    courseTerm: "Spring 2019",
    courseFaculty: "Mesut Ozil"
  }
];

let announcements = [
  {
    header: "Github Access",
    plaintext:
      "Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:
      "<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
    author: "Arivoli"
  },
  {
    header: "Short Announcement",
    plaintext:
      "Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:
      "<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
    author: "Arivoli"
  }
];
let assignments = [
  {
    header: "Lab #1 : Canvas",
    plaintext:
      "Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",

    body:
      "<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
    due: "26 Feb by 23:00",
    points: 5,
    available: "27 Feb at 23:00"
  },
  {
    header: "Lab #2 : Canvas with kafka",
    plaintext:
      "Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:
      "<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
    due: "26 Feb by 23:00",
    points: 5,
    available: "27 Feb at 23:00"
  }
];
let grades = [
  {
    header: "Lab #1 : Canvas",
    body:
      "Objectives: This lab assignment is designed to enable students to gain some hands-on experience on Amazon’s EC2. Each student is required to work on this laboratory assignment individually and submit your deliverables into Canvas.",
    due: "26 Feb by 23:00",
    status: "submitted",
    score: 4,
    points: 5,
    available: "27 Feb at 23:00"
  },
  {
    header: "Lab #2 : Canvas with kafka",
    body:
      "Objectives: This lab assignment is designed to enable students to gain some hands-on experience on Amazon’s EC2. Each student is required to work on this laboratory assignment individually and submit your deliverables into Canvas.",
    due: "26 Feb by 23:00",
    status: "submitted",
    score: 3,
    points: 5,
    available: "27 Feb at 23:00"
  }
];

let people = [
  {
    name: "aaron",
    courseTerm: "Spring 2019",
    courseDepartment: "CMPE",
    courseId: "281",
    role: "student"
  },
  {
    name: "mesut",
    courseTerm: "Spring 2019",
    courseDepartment: "CMPE",
    courseId: "281",
    role: "student"
  },
  {
    name: "Alex",
    courseTerm: "Spring 2019",
    courseDepartment: "CMPE",
    courseId: "281",
    role: "student"
  },
  {
    name: "Lacazette",
    courseTerm: "Spring 2019",
    courseDepartment: "CMPE",
    courseId: "281",
    role: "Teacher"
  },
  {
    name: "Aubameyang",
    courseTerm: "Spring 2019",
    courseDepartment: "CMPE",
    courseId: "281",
    role: "student"
  }
];

courses.post("/removestudent", (req, res) => {
  try {
    let { uid, cid } = req.body;
    //    console.log("uid"+uid);
    //    console.log("cid"+cid);
    (async () => {
      let result3 = await userModel.updateOne(
        { _id: uid },
        { $pull: { courses: cid } }
      );
      let result4 = await courseModel.findOne({ _id: cid });
      let result5 = await courseModel.updateOne(
        { _id: cid },
        { currEnrollment: result4.currEnrollment - 1 }
      );
      res
        .status(200)
        .json({ message: "Student was dropped from the course !" });
      // let sql=`DELETE FROM Enrollment WHERE uid=${uid} AND cid=${cid}`
      // await query(sql);
      // res.status=200;
      // res.setHeader("Content-Type", "application/json");
      // res.send(JSON.stringify({message:"Student was dropped from the course !"}));
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});
courses.post("/createquiz", (req, res) => {
  let {
    header,
    bodyText,
    timelimit,
    due,
    availablefrom,
    availableto,
    assignto,
    questionlist
  } = req.body;
  // console.log(header);
  // console.log(bodyText);
  // console.log(timelimit);
  // console.log(due);
  // console.log(assignto);
  // console.log(availablefrom);
  // console.log(availableto);
  // console.log(questionlist);

  (async () => {
    try {
      let questions = questionlist.map(data => {
        return {
          question: data.question,
          answer: data.correctanswer,
          options: [
            data.option2,
            data.correctanswer,
            data.option3,
            data.option4
          ]
        };
      });
      let obj = {
        heading: header,
        description: bodyText,
        posted: new Date().toJSON(),
        due,
        availablefrom,
        availableto,
        timelimit,
        published: 0,
        points: questions.length,
        questions
      };
      let result = await courseModel.update(
        { _id: assignto },
        {
          $push: { quiz: obj }
        }
      );
      // let result=await courseModel.update({_id:assignto},{
      //     $push:{
      //         quiz:obj
      //     }
      // });
      // console.log("cid"+cid);
      // let result=await query(sql,{
      //    heading:header,
      //    description:bodyText,
      //    posted:new Date().toJSON(),
      //    cid:assignto,
      //    due,
      //    availablefrom,
      //    availableto,
      //    timelimit,
      //    published:0,
      //    points:questionlist.length
      // });
      // //console.log(result);
      // let qid=result.insertId;
      // questionlistobj=questionlist.map((data)=>{
      //     let obj=[data.question,data.correctanswer,qid];
      //     return obj;
      // });

      // sql=`INSERT INTO Question (question,answer,qid) VALUES ?`;
      //  result=await query(sql,[questionlistobj]);
      // console.log("Almost done");
      // console.log(result);
      // let quesid=result.insertId;

      // let optionslistobj=[];
      // questionlist.forEach((data)=>{
      //     optionslistobj.push([data.correctanswer,quesid]);
      //     optionslistobj.push([data.option2,quesid]);
      //     optionslistobj.push([data.option3,quesid]);
      //     optionslistobj.push([data.option4,quesid]);
      //     quesid++;
      // });

      // sql=`INSERT INTO Options (optionText,quesid) VALUES ?`;
      // result=await query(sql,[optionslistobj]);
      // console.log(result);
      // res.status=200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Questions inserted!" }));
    } catch (error) {
      // this.errorFunc(error);
      console.log("In Error");
      console.log(error);
    }
  })();
});
courses.post("/getquizes", (req, res) => {
  let { cid } = req.body;
  (async () => {
    try {
      let result = await courseModel.findOne({ _id: cid });
      let quiz = result.quiz.map(data => {
        return allidMutator(data, "_id", "qid");
      });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(quiz));
    } catch (error) {
      console.log(error);
    }
  })();
});
courses.get("/getallusers", (req, res) => {
  (async () => {
    try {
      let result = await userModel.find();
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(result));
    } catch (error) {
      console.log(error);
    }
  })();
});
courses.post("/getchats", (req, res) => {
  (async () => {
    try {
      let { uid } = req.body;
      console.log("For chats");
      console.log(uid);
      let result = await userModel
        .findOne({ _id: uid })
        .populate({ path: "chats.uid", select: ["name", "profileImage"] })
        .exec();
      console.log(result);
      let chatArray = [];
      if (result.chats) {
        chatArray = result.chats;
      }
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(chatArray));
    } catch (error) {
      console.log(error);
    }
  })();
});
courses.post("/message", (req, res) => {
  (async () => {
    try {
      let { receiverid, uid, messagetext } = req.body;
      console.log(receiverid);
      console.log(uid);
      console.log(messagetext);

      let receiverObj = {
        action: "received",
        messagetext
      };
      let senderObj = {
        action: "sent",
        messagetext
      };
      let chatchecksender = await userModel.findOne({
        _id: uid,
        "chats.uid": receiverid
      });
      if (chatchecksender) {
        console.log("inside existing chats");
        let senderResult = await userModel.updateOne(
          {
            _id: uid,
            chats: {
              $elemMatch: {
                uid: receiverid
              }
            }
          },
          {
            $push: {
              "chats.$.messages": senderObj
            }
          }
        );
      } else {
        let senderUpperObj = {
          uid: receiverid,
          messages: [
            {
              action: "sent",
              messagetext
            }
          ]
        };
        let ress = await userModel.findOneAndUpdate(
          { _id: uid },
          {
            $push: {
              chats: senderUpperObj
            }
          }
        );
      }

      let chatcheckreceiver = await userModel.findOne({
        _id: receiverid,
        "chats.uid": uid
      });
      if (chatcheckreceiver) {
        let receiverResult = await userModel.updateOne(
          {
            _id: receiverid,
            chats: {
              $elemMatch: {
                uid: uid
              }
            }
          },
          {
            $push: {
              "chats.$.messages": receiverObj
            }
          }
        );
      } else {
        let recUpperObj = {
          uid: uid,
          messages: [
            {
              action: "received",
              messagetext
            }
          ]
        };
        let ress = await userModel.findOneAndUpdate(
          { _id: receiverid },
          {
            $push: {
              chats: recUpperObj
            }
          }
        );
      }
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Message posted" }));
    } catch (error) {
      console.log(error);
    }
  })();
});

courses.post("/getquizestudent", (req, res) => {
  let { cid } = req.body;
  (async () => {
    try {
      let result = await courseModel.findOne({
        _id: cid,
        quiz: { $elemMatch: { published: 1 } }
      });
      //    let result=await query(sql);
      console.log("quiz student");
      console.log(result);
      let quiz = result.quiz.map(data => {
        return allidMutator(data, "_id", "qid");
      });
      quiz = quiz.filter(data => {
        return data.published;
      });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      console.log(quiz);
      res.send(JSON.stringify(quiz));
    } catch (error) {
      console.log(error);
    }
  })();
});
courses.post("/getquizscore", (req, res) => {
  let { qid, uid, cid } = req.body;
  (async () => {
    try {
      console.log(qid);
      console.log(uid);
      let result = await courseModel.findOne({
        "quiz._id": qid,
        "quiz.quizsubmission.uid": uid
      });
      console.log(result);
      let quizsub = [];
      if (result) {
        quizsub = result.quiz.filter(data => {
          return data._id == qid;
        });
      }
      console.log("==========>");
      console.log(qid);
      console.log(uid);
      let subArr = [];
      if (quizsub[0]) {
        subArr = quizsub[0].quizsubmission.filter(data => {
          return data.uid == uid;
        });
      }
      // let sql=``;
      // if(qid==0){
      //     sql=`SELECT q.heading AS header,q.*,g.* FROM Quiz AS q,Quizgrades AS g WHERE q.qid=g.qid AND g.uid=${uid} AND q.cid=${cid}`;
      // }else{
      // sql=`SELECT * FROM Quiz AS q,Quizgrades AS g WHERE q.qid=g.qid AND g.qid=${qid} AND g.uid=${uid}`;
      // }
      // let result=await query(sql);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(subArr));
    } catch (error) {
      console.log(error);
    }
  })();
});

courses.post("/getquizbyid", (req, res) => {
  let { qid } = req.body;
  (async () => {
    try {
      // let sql=`SELECT * FROM Quiz AS q,Question AS s,Options AS o WHERE q.qid=s.qid AND s.quesid=o.quesid AND q.qid=${19}`;
      // let result=await query(sql);
      let result = await courseModel.findOne(
        { "quiz._id": qid },
        { "quiz.$": 1 }
      );

      let {
        heading,
        description,
        posted,
        due,
        availablefrom,
        availableto,
        timelimit,
        published,
        points
      } = result.quiz[0];
      let iniObj = {
        qid,
        heading,
        description,
        posted,
        due,
        availablefrom,
        availableto,
        timelimit,
        published,
        points
      };
      let finalArray = [];
      result.quiz[0].questions.forEach(data => {
        let aftobj = {
          quesid: data._id,
          question: data.question,
          answer: data.answer
        };
        data.options.forEach(text => {
          finalArray.push({ ...iniObj, ...aftobj, optionText: text });
        });
      });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(finalArray));
    } catch (error) {
      console.log(error);
    }
  })();
});

courses.post("/updateprofile", (req, res) => {
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
        Bucket: "canvas-data",
        Key: uid,
        Body: req.files.file.data
      };
      //  s3.upload(params,function(err,data){
      //      console.log(data)
      //  });
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

courses.get("/getprofilebyid/:id", requireAuth, (req, res) => {
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

courses.post("/quizsubmission", (req, res) => {
  let { quizanswers, quesMap } = req.body;
  let qid = quizanswers[0][2];
  let uid = quizanswers[0][3];
  //console.log(quesMap);
  (async () => {
    try {
      let score = 0;
      quizanswers.forEach(data => {
        // console.log(data[1]);
        // console.log(quesMap[data[0]][0].answer);
        if (data[1] == quesMap[data[0]][0].answer) {
          score++;
        }
      });
      let answers = quizanswers.map(data => {
        return {
          questionId: data[0],
          answer: data[1]
        };
      });
      let finalObj = {
        uid,
        answers,
        grades: score
      };
      console.log("final ojb is ==========================================>");
      console.log(quizanswers);
      let result4 = await courseModel.updateOne(
        {
          quiz: {
            $elemMatch: {
              _id: qid
            }
          }
        },
        {
          $push: {
            "quiz.$.quizsubmission": finalObj
          }
        }
      );

      //    let sql=`INSERT INTO Quizsubmission (quesid,answer,qid,uid) VALUES ?`;
      //     result=await query(sql,[quizanswers]);

      //     sql=`INSERT INTO Quizgrades (qid,uid,grades) VALUES (${qid},${uid},${score})`;
      //     await query(sql);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Quiz submitted successfully!" }));
    } catch (error) {
      console.log(error);
    }
  })();
});

courses.post("/createannouncements", (req, res) => {
  try {
    (async () => {
      let {
        email: uid,
        courseId: cid,
        bodyText,
        plainText,
        headerText: header
      } = req.body;
      let obj = {
        header,
        bodyText,
        plainText,
        posted: new Date().toJSON()
      };

      let result = await courseModel.update(
        { _id: cid },
        {
          $push: { announcement: obj }
        }
      );
      let result2 = await courseModel.findOne({ _id: cid });
      res.status(200).json(result2.announcement);
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});

courses.post("/createassignments", (req, res) => {
  let {
    courseId: cid,
    bodyText,
    plainText,
    headerText: header,
    due,
    available,
    points
  } = req.body;
  let obj = {
    header,
    bodyText,
    due,
    available,
    points,
    plainText,
    posted: new Date().toJSON()
  };
  try {
    (async () => {
      // let sql=`INSERT INTO Assignments SET ?`;
      // await con.query(sql,obj);
      let result = await courseModel.update(
        { _id: cid },
        {
          $push: {
            assignments: obj
          }
        }
      );
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Assignment posted successfully !" }));
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});

courses.post("/people", (req, res) => {
  try {
    let { email: uid, courseId: cid, courseDepartment } = req.body;
    (async () => {
      let result = await userModel.find({ courses: cid });
      let users = result.map(data => {
        return idMutator(data);
      });
      // let sql=`SELECT E.*,U.*,C.courseDepartment,C.courseTerm,C.courseId FROM Enrollment AS E,Users AS U,Course AS C WHERE E.uid=U.uid AND C.cid=E.cid AND E.cid=${cid}`;
      // let result=await query(sql);
      // let sql2=`SELECT * FROM Users AS U,Course AS C WHERE C.cid=${cid} AND U.uid=C.uid`;
      // let result2=await query(sql2);
      // result=result.concat(result2);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(users));
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});

courses.post("/grades", (req, res) => {
  let { uid, cid } = req.body;
  console.log("=====>>>>=====>>>>");
  console.log(cid);
  console.log(uid);
  (async () => {
    try {
      let response = await courseModel.findOne({ _id: cid });
      let arr = [];
      console.log(response.assignments);
      response.assignments.map(data => {
        // var info=data;
        data.submission.map(ele => {
          if (ele.uid == uid) {
            arr.push({
              header: data.header,
              due: data.due,
              points: data.points,
              uid: ele.uid,
              grades: ele.grades
            });
          }
        });
      });
      response.quiz.map(data => {
        var info = data;
        data.quizsubmission.map(ele => {
          if (ele.uid == uid) {
            arr.push({
              header: data.heading,
              due: data.due,
              points: data.points,
              uid: ele.uid,
              grades: ele.grades
            });
          }
        });
      });
      // console.log(arr);
      // let sql=`SELECT * FROM Assignments AS A , Submission AS S WHERE A.aid=S.aid AND A.cid=${cid} AND S.uid=${uid}`;
      // let response=await query(sql);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(arr));
    } catch (error) {
      // this.errorFunc(error,res)
    }
  })();
});

courses.post("/upload", (req, res) => {
  try {
    let uploadFile = req.files;

    let { uid, aid } = req.body;

    //  s3.upload(params,function(err,data){
    //      console.log(data)
    //  });

    console.log(aid);
    console.log(uid);
    (async () => {
      let resultone = await courseModel.findOne({
        "assignments._id": aid,
        "assignments.submission.uid": uid
      });
      console.log("================================>>>>");
      //   console.log(resultone);

      let fileArray = [];
      for (let x in uploadFile) {
        let { data: file, name: filename } = uploadFile[x];
        // let obj=[file,filename,sid];
        // fileArray.push(obj);
        const params = {
          Bucket: "canvas-data",
          Key: uid + aid + filename,
          Body: file
        };

        let ress = await awsupload(params);
        fileArray.push({ file: ress.Location, filename: filename + ".pdf" });
      }
      let obj = {
        uid,
        submissionfile: fileArray
      };

      // console.log(obj);
      if (!resultone) {
        let result4 = await courseModel.updateOne(
          {
            assignments: {
              $elemMatch: {
                _id: aid
              }
            }
          },
          {
            $push: {
              "assignments.$.submission": obj
            }
          }
        );
      } else {
        let result4 = await courseModel.updateOne(
          {
            assignments: {
              $elemMatch: {
                _id: aid
              }
            }
          },
          {
            $pull: {
              "assignments.$.submission": {
                uid
              }
            }
          },
          {
            $push: {
              "assignments.$.submission": obj
            }
          }
        );

        let result5 = await courseModel.updateOne(
          {
            assignments: {
              $elemMatch: {
                _id: aid
              }
            }
          },
          {
            $push: {
              "assignments.$.submission": obj
            }
          }
        );
      }
      // let sql=`SELECT sid FROM Submission WHERE uid=${uid} AND aid=${aid}`;
      // let result=await query(sql);
      // let sid=null;
      // if(result.length!=0){
      // sid=result[0].sid;
      // }
      // if(sid){
      //     sql=`DELETE FROM SubmissionFile WHERE sid=${sid}`;
      //     await query(sql);
      //       let fileArray=[];
      //     for(let x in uploadFile){
      //         let {data:file,name:filename}=uploadFile[x];
      //         let obj=[file,filename,sid];
      //         fileArray.push(obj);
      //     }
      //     sql=`INSERT INTO SubmissionFile (file,filename,sid) VALUES ?`;
      //     console.log(fileArray);
      //     await con.query(sql,[fileArray]);

      // }else{
      //     let obj={grades:null,uid,aid};
      //     sql=`INSERT INTO Submission SET ?`;
      //     let result=await query(sql,obj);
      //     let id=result.insertId;
      //     // console.log(result.insertId);
      //     let fileArray=[];
      //     for(let x in uploadFile){
      //         let {data:file,name:filename}=uploadFile[x];
      //         let obj=[file,filename,id];
      //         fileArray.push(obj);
      //     }
      //     sql=`INSERT INTO SubmissionFile (file,filename,sid) VALUES ?`;
      //     console.log(fileArray);
      //     await con.query(sql,[fileArray]);
      // }
    })();
    res.status = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ message: "File Uploaded Successfully" }));
  } catch (error) {
    console.log("hello");
    console.log(error);
    this.errorFunc(error);
  }
});

courses.post("/getawsfile", (req, res) => {
  const { region, bucket, key } = AmazonS3URI(req.body.url);
  var getParams = {
    Bucket: "canvas-data", // your bucket name,
    Key: key // path to the object you're looking for
  };
  s3.getObject(getParams, function(err, data) {
    res.status(200).json(data);
  });
});
courses.post("/assignments", (req, res) => {
  try {
    let { email, courseId: cid, courseDepartment } = req.body;
    (async () => {
      // let sql=`SELECT * FROM Assignments WHERE cid=${cid}`;
      // let result=await query(sql);
      let result = await courseModel.findOne({ _id: cid });
      console.log("===================>");
      console.log(result.assignments);
      let assignments = result.assignments.map(data => {
        return allidMutator(data, "_id", "aid");
      });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(assignments));
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});

courses.post("/publishquiz", (req, res) => {
  try {
    let { qid } = req.body;
    (async () => {
      let result4 = await courseModel.update(
        {
          quiz: {
            $elemMatch: {
              _id: qid
            }
          }
        },
        {
          $set: {
            "quiz.$.published": 1
          }
        }
      );
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Quiz Published" }));
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});
courses.post("/announcements", requireAuth, (req, res) => {
  try {
    let { courseId: cid } = req.body;
    (async () => {
      let result = await courseModel.findOne({ _id: cid });
      // console.log(result);
      res.status(200).json(result.announcement);
    })();
  } catch (error) {
    this.errorFunc(error, res);
  }
});

//home dashboard courses

// courses.post("/", requireAuth, async (req, res) => {
//   let ress = await courseModel.remove({ _id: "5cb58aaccbfec417701b212e" });

//   kafka.make_request("getallcourses", req.body, function(err, results) {
//     console.log("in result");
//     console.log(results);
//     if (err) {
//       console.log("Inside err");
//       res.json({
//         status: "error",
//         message: "System Error, Try Again."
//       });
//       res.end();
//     } else {
//       console.log("Inside else");
//       res.status(200).json(results);
//     }
//   });
// });
courses.post("/getsubmissionfiles", (req, res) => {
  (async () => {
    try {
      let { uid, aid } = req.body;
      let result = await courseModel.findOne({ "assignments._id": aid });
      let resAssign = result.assignments.filter(data => {
        return data._id == aid;
      });
      let answerSend = [];
      if (resAssign[0]) {
        resSubmission = resAssign[0].submission.filter(data => {
          return data.uid == uid;
        });

        answerSend = resSubmission[0].submissionfile;
      }

      // let sql=`SELECT * FROM Submission AS S,SubmissionFile AS F WHERE S.sid=F.sid AND S.uid=${uid} AND S.aid=${aid}`;
      // console.log(sql);
      // let response=await query(sql);
      // let response=await courseModel.findOne({"assignments._id":aid});
      // let subArray=response.assignments.filter((data)=>{
      //     return data._id==aid
      // });
      // let subArraytwo=subArray.submission.filter((data)=>{
      //     return data._id==uid
      // });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(answerSend));
    } catch (error) {
      console.log(error);
    }
  })();
});
courses.post("/submitgrade", (req, res) => {
  (async () => {
    try {
      let { sid, uid, aid, grades } = req.body;
      // let sql=`UPDATE Submission SET grades=${grades} WHERE sid=${sid}`;
      console.log(aid);
      console.log(uid);
      let result4 = await courseModel.update(
        { "assignments._id": aid },
        {
          $set: {
            "assignments.$[i].submission.$[j].grades": grades
          }
        },
        {
          arrayFilters: [
            {
              "i._id": aid // tour_name -  current tour name,  new_name - new tour name
            },
            {
              "j.uid": uid
            }
          ]
        }
      );
      // let result4=await courseModel.updateOne({
      //     "assignments":{
      //           $elemMatch: {
      //            _id: aid,
      //           "submission.uid":uid
      //         }
      //    }
      // }, {
      //        $set: {
      //            'assignments.$[outer].submission.$[inner].grades': grades
      //        }
      //    });

      // let response=await query(sql);
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(result4));
    } catch (error) {
      // this.errorFunc(error,res);
      console.log(error);
    }
  })();
});
courses.post("/getsubmissionbyid", (req, res) => {
  (async () => {
    try {
      let { aid, uid } = req.body;
      //    let sql=`SELECT * FROM Submission AS S,SubmissionFile AS U WHERE S.sid=U.sid AND S.aid=${aid} AND S.uid=${uid}`;
      //    console.log(sql);
      //    let response=await query(sql);
      let result = await courseModel.findOne({ "assignments._id": aid });

      let resAssign = result.assignments.filter(data => {
        return data._id == aid;
      });
      console.log(resAssign);
      let resSubmission = resAssign[0].submission.filter(data => {
        return data.uid == uid;
      });

      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(resSubmission[0]));
    } catch (error) {
      // this.errorFunc(error,res);
      console.log(error);
    }
  })();
});
courses.post("/assignSubmitted", (req, res) => {
  (async () => {
    try {
      let { aid } = req.body;
      let result = await courseModel.find(
        {
          assignments: {
            $elemMatch: {
              _id: aid
            }
          }
        },
        {
          "assignments.$": 1
        }
      );

      var array = [];
      let x = result[0].assignments[0].submission;
      for (let i = 0; i < x.length; i++) {
        let ress = await userModel.findOne({ _id: x[i].uid });
        let obj = {
          name: ress.name,
          submissionfile: x[i].submissionfile,
          uid: x[i].uid,
          aid
        };
        array.push(obj);
      }
      //    result[0].assignments[0].submission.forEach((data)=>{
      //        (async()=>{
      //         let ress=await userModel.findOne({_id:data.uid})
      //         let obj={
      //              name:ress.name,
      //              submissionfile:data.submissionfile
      //         }
      //         console.log(obj);
      //         array.push(obj);
      //        })()

      //    })

      //    .populate({assignments:{submission:{path:"uid",select:"name"}}}).exec();
      //    .populate({path:'assignments',populate:{path:"submission",select:"name"}}).exec()
      // let sql=`SELECT U.name,S.grades,S.uid,S.aid FROM Submission AS S,Users AS U WHERE S.uid=U.uid AND S.aid=${aid}`;
      // console.log(sql);
      // let response=await query(sql);
      // console.log("result");
      // console.log(result[0].assignments);
      console.log("==================>>>=========");
      console.log(array);
      //   result[0].assignments[0].submission.map((data)=>{

      //   });
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(array));
    } catch (error) {
      console.log(error);
    }
  })();
});

courses.post("/drop", (req, res) => {
  (async () => {
    try {
      let data = {
        status: 0,
        message: "You have successfully dropped the class !"
      };
      let { email: uid, courseId: cid } = req.body;

      let result = await userModel.findOne({ _id: uid, courses: cid });
      console.log(result);
      if (result) {
        let result3 = await userModel.update(
          { _id: uid },
          { $pull: { courses: cid } }
        );
        let result4 = await courseModel.findOne({ _id: cid });
        let result5 = await courseModel.updateOne(
          { _id: cid },
          { currEnrollment: result4.currEnrollment - 1 }
        );
        res.status(200).json(data);
      } else {
        let result3 = await userModel.update(
          { _id: uid },
          { $pull: { waitlistcourses: cid } }
        );
        let result4 = await courseModel.findOne({ _id: cid });
        let result5 = await courseModel.updateOne(
          { _id: cid },
          { currWaitlist: result4.currWaitlist - 1 }
        );
        res.status(200).json(data);
      }

      // console.log(`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
      // let result=await query(`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
      // let status=result[0].status;
      // let response=await query(`SELECT * FROM Course WHERE cid=${cid}`);
      // let course=response[0];
      // let {currEnrollment,currWaitlist}=response[0];
      // if(result[0].status=="Enrolled"){
      //     await query(`UPDATE Course SET currEnrollment=${course.currEnrollment-1} WHERE cid=${cid}`);
      // }else{
      //     await query(`UPDATE Course SET currWaitlist="${course.currWaitlist-1}" WHERE cid=${cid}`);
      // }
      //     await query(`DELETE FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
      // //insert course enrollment data
      // res.status=200;
      // res.setHeader("Content-Type", "application/json");
      // res.send(JSON.stringify(data));
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});
courses.post("/enroll", (req, res) => {
  (async () => {
    let { email: uid, courseId: cid } = req.body;

    let iniCheck = `SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`;
    console.log(`User id = ${uid}`);
    console.log(`Course id = ${cid}`);
    let result = await userModel.findOne({ _id: uid, courses: cid });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: 0,
        message: "You are already enrolled/waitlisted for this class !"
      });
    } else {
      let course = await courseModel.findOne({ _id: cid });
      if (course.courseCapacity == course.currEnrollment) {
        if (course.waitlistCapacity == course.currWaitlist) {
          //class is full
          res.status(200).json({
            status: 0,
            message: "Class is full. Please try enrolling for another class"
          });
        } else {
          //can waitlist
          let result3 = await userModel.update(
            { _id: uid },
            { $push: { waitlistcourses: cid } }
          );
          let result4 = await courseModel.update(
            { _id: cid },
            { currWaitlist: course.currWaitlist + 1 }
          );
          res.status(200).json({
            status: 0,
            message: "You have been wailisted for this course!"
          });

          // let sql=`INSERT INTO Enrollment VALUES ("Waitlist",${uid},${cid})`;
          // await query(`UPDATE Course SET currWaitlist="${course.currWaitlist+1}" WHERE cid=${cid}`);
          // let result=await query(sql);
          //data.message="";
        }
      } else {
        //can enroll
        let result3 = await userModel.update(
          { _id: uid },
          { $push: { courses: cid } }
        );
        let result4 = await courseModel.update(
          { _id: cid },
          { currEnrollment: course.currEnrollment + 1 }
        );
        res.status(200).json({
          status: 0,
          message: "You have been enrolled for this course!"
        });
        // let sql=`INSERT INTO Enrollment VALUES ("Enrolled",${uid},${cid});`;
        // let result=await query(sql);
        // await query(`UPDATE Course SET currEnrollment=${course.currEnrollment+1} WHERE cid=${cid}`);
        // data.message="You have been Enrolled in this course!"
      }
    }
    console.log(result);
    // try {
    //     let data={
    //         status:0,
    //         message:""
    //     };

    //     let response=await query(iniCheck);
    //     if(response.length!=0){
    //         data.message="You are already enrolled/waitlisted for this class !"
    //     }else{
    //     let sql=`SELECT * FROM Course WHERE cid=${cid}`;
    //     let result=await query(sql);
    //     let course=result[0];
    //     if(course.courseCapacity==course.currEnrollment){
    //         if(course.waitlistCapacity==course.currWaitlist){
    //             //class is full
    //             data.message="Class is full. Please try enrolling for another class";
    //         }else{
    //             //can waitlist
    //             let sql=`INSERT INTO Enrollment VALUES ("Waitlist",${uid},${cid})`;
    //             await query(`UPDATE Course SET currWaitlist="${course.currWaitlist+1}" WHERE cid=${cid}`);
    //             let result=await query(sql);
    //             data.message="You have been wailisted for this course!";
    //         }
    //     }else{
    //         //can enroll
    //         let sql=`INSERT INTO Enrollment VALUES ("Enrolled",${uid},${cid});`;
    //         let result=await query(sql);
    //         await query(`UPDATE Course SET currEnrollment=${course.currEnrollment+1} WHERE cid=${cid}`);
    //         data.message="You have been Enrolled in this course!"

    //     }
    // }
    //     res.status=200;
    //     res.setHeader("Content-Type", "application/json");
    //     res.send(JSON.stringify(data));
    // } catch (error) {
    //     console.log(error);
    //    // errorFunc(error,res);
    // }
  })();
});
courses.get("/getcourse/:id", (req, res) => {
  (async () => {
    try {
      let result = await courseModel.find({ _id: req.params.id });
      res.status(200).json(result);
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});

courses.post("/search", (req, res) => {
  (async () => {
    let searchTerm = req.body.selectedOption;
    let searchValue = req.body[searchTerm];
    console.log(searchTerm);
    console.log(searchValue);
    if (searchTerm === "courseId") {
      let { filterOption, courseId } = req.body;
      if (courseId === "") {
        courseId = 0;
      }
      let results = [];
      try {
        switch (filterOption) {
          case ">":
            results = await courseModel
              .find({ courseId: { $gte: courseId } })
              .populate({ path: "uid", select: "name" })
              .exec();
            break;
          case "<":
            results = await courseModel
              .find({ courseId: { $lte: courseId } })
              .populate({ path: "uid", select: "name" })
              .exec();
            break;
          case "=":
            results = await courseModel
              .find({ courseId })
              .populate({ path: "uid", select: "name" })
              .exec();
            break;
        }
        let result = results.map(data => {
          return cidMutator(data);
        });
        res.status(200).json(result);
      } catch (error) {
        errorFunc(error, res);
      }
    } else {
      let query = {};
      query[searchTerm] = new RegExp(searchValue);
      console.log(query);
      let results = await courseModel
        .find(query)
        .populate({ path: "uid", select: "name" })
        .exec();
      let result = results.map(data => {
        return cidMutator(data);
      });

      res.status(200).json(result);
    }
  })();
});

//create a course

courses.post("/create", (req, res) => {
  console.log("inside create courses");

  (async () => {
    try {
      let {
        courseId,
        courseName,
        courseDepartment,
        courseDescription,
        courseRoom,
        courseCapacity,
        waitlistCapacity,
        courseTerm,
        uid
      } = req.body;
      let result = await courseModel.findOne({
        courseId: courseId,
        courseTerm
      });
      console.log(result);
      if (result) {
        res
          .status(200)
          .json({ createstatus: 0, message: "Course Id Already exists !" });
      } else {
        let newcourse = new courseModel({
          courseId,
          courseName,
          courseDepartment,
          courseDescription,
          courseRoom,
          courseCapacity,
          waitlistCapacity,
          courseTerm,
          uid,
          currEnrollment: 0,
          currWaitlist: 0
        });
        let result2 = await newcourse.save();
        let { _id: courseid } = result2;
        let result3 = await userModel.update(
          { _id: uid },
          { $push: { courses: courseid } }
        );
        res
          .status(200)
          .json({ createstatus: 1, message: "Course created successfully !" });
      }
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});

courses.get("/addcodes/:cid", (req, res) => {
  let cid = req.params.cid;
  (async () => {
    try {
      let result1 = await courseModel.findOne({ _id: cid });
      console.log(result1.permissioncode);
      res.status(200).json(result1.permissioncode);
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});
courses.post("/addcodeenroll", (req, res) => {
  let { email: uid, code } = req.body;
  let data = {
    status: 0,
    message: ""
  };
  (async () => {
    try {
      let result = await courseModel.findOne({
        permissioncode: { $elemMatch: { code } }
      });
      console.log(result);
      if (!result) {
        data.message = "Add code invalid";
      } else {
        let { _id: cid } = result;
        let used = 0;
        for (let data of result.permissioncode) {
          if (data.code == code) {
            used = data.used;
            break;
          }
        }
        if (used) {
          data.message = "The Add code has already been used";
        } else {
          let ress = await userModel.findOne({ _id: uid, courses: cid });
          if (ress) {
            data.message = "You are already enrolled in this class!";
          } else {
            let result2 = await userModel.update(
              { _id: uid },
              {
                $push: { courses: cid }
              }
            );
            let result3 = await userModel.update(
              { _id: uid },
              {
                $pull: { waitlistcourses: cid }
              }
            );
            let result4 = await courseModel.update(
              {
                _id: cid,
                permissioncode: {
                  $elemMatch: {
                    code: code
                  }
                }
              },
              {
                $set: {
                  "permissioncode.$.used": 1
                }
              }
            );
            console.log(result4);
            data.message =
              "Congratulations ! You are now enrolled in this course!";
          }
        }
      }
      res.status(200).json(data);
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});

courses.post("/addcodes", (req, res) => {
  let { cid } = req.body;
  (async () => {
    try {
      let result1 = await courseModel.find();
      let numArray = [];
      for (let i = 0; i < result1.length; i++) {
        let innerArray = result1[i].permissioncode.map(data => {
          return data.code;
        });
        numArray = numArray.concat(innerArray);
      }

      let randomNum = 0;
      let index = 0;
      while (index != -1) {
        randomNum = Math.floor(100000 + Math.random() * 900000);
        index = numArray.indexOf(randomNum);
      }
      let obj = { code: randomNum, used: 0, uid: null };
      let result = await courseModel.update(
        { _id: cid },
        {
          $push: { permissioncode: obj }
        }
      );
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ message: "Add Code Generated" }));
    } catch (error) {
      errorFunc(error, res);
    }
  })();
});
courses.post("/lecfiles", (req, res) => {
  let uploadFile = req.files.file;
  let fileName = req.files.file.name;
  let { cid } = req.body;
  (async () => {
    var post = {
      file: uploadFile.data,
      filename: fileName,
      posted: new Date().toJSON(),
      cid: cid
    };
    //await con.query('INSERT INTO LectureFiles SET ?', post)
    const params = {
      Bucket: "canvas-data",
      Key: cid + fileName,
      Body: req.files.file.data
    };
    let ress = await awsupload(params);
    let obj = {
      file: ress.Location,
      filename: fileName,
      posted: new Date().toJSON()
    };
    let result = await courseModel.update(
      { _id: cid },
      {
        $push: {
          lecturefiles: obj
        }
      }
    );
    //  s3.upload(params,function(err,data){
    //      console.log(data)
    //  });

    console.log(ress);
  })();
  res.status = 200;
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ message: "File Uploaded Successfully" }));
});

courses.get("/lecfiles/:cid", (req, res) => {
  let cid = req.params.cid;
  (async () => {
    //var post  = {file: uploadFile.data, filename: 'Hello MySQL',posted:"",cid:cid};
    //let result=await query("SELECT * FROM `LectureFiles` WHERE cid="+cid);
    let result = await courseModel.findOne({ _id: cid });
    let finalArr = [];
    let lecturefiles = result.lecturefiles;
    for (let i = 0; i < lecturefiles.length; i++) {
      let data = lecturefiles[i];
      const { key } = AmazonS3URI(data.file);
      var getParams = {
        Bucket: "canvas-data", // your bucket name,
        Key: key // path to the object you're looking for
      };
      let dataFile = await awsdownload(getParams);
      finalArr.push({
        posted: data.posted,
        filename: data.filename,
        file: dataFile.Body
      });
    }

    console.log("==>=>+>+>+>+>+>+>+>+>=>+>=>=>=>=>=>=>=>==.=>=>=>=>=>=>+>");
    console.log(finalArr);
    res.status = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(finalArr));
  })();
});

module.exports = courses;
