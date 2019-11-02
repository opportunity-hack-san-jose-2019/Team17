let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('../server');
let should = chai.should();
var app = require('../index');

chai.use(chaiHttp);

  describe('/POST login', () => {
      it('check for correct credentials', (done) => {
        let login = {
            email: "kunal.pavashiya@sjsu.edu",
            password: "12345"
        }
        chai.request(app)
            .post('/login')
            .send(login)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('loginSuccess').eql(1);
              done();
            });
      });

  });
 
 
  describe('/POST getquizes', () => {
      it('Get quizes by id', (done) => {
        let login = {
           cid:1
        }
        chai.request(app)
            .post('/courses/getquizes')
            .send(login)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body[0].should.have.property('qid');
                  res.body[0].should.have.property('heading');
                  res.body[0].should.have.property('description');
              done();
            });
      });

  });


  describe('/POST getquizestudent', () => {
      it('Get quizes by id for students ', (done) => {
        let login = {
           cid:1
        }
        chai.request(app)
            .post('/courses/getquizestudent')
            .send(login)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body[0].should.have.property('qid');
                  res.body[0].should.have.property('heading');
                  res.body[0].should.have.property('description');
              done();
            });
      });

  });
 
  describe('/POST getquizscore', () => {
      it('Get quiz score of a student ', (done) => {
        let login = {
           uid:1,
           qid:19
        }
        chai.request(app)
            .post('/courses/getquizscore')
            .send(login)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body[0].should.have.property('grades');
              done();
            });
      });

  });
 
  describe('/POST getprofilebyid', () => {
      it('Get Profile of a user ', (done) => {
        chai.request(app)
            .get('/courses/getprofilebyid/1')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body[0].should.have.property('name');
                  res.body[0].should.have.property('profileImage');
              done();
            });
      });

  });
// });