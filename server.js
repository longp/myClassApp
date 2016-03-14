var express = require("express");
var exphbs = require("express-handlebars");
var Sequelize = require("sequelize");
var bodyParser = require("body-parser");
var session = require('express-session');
var app = express();
const PORT = 3000;
var connection = new Sequelize('class_db', 'root', '');

app.use("/js", express.static('public/js'));
app.use("/css", express.static('public/style'));

var Student = connection.define('Student', {
  studentUsername: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlphanumeric: true
    }
  },
  studentFirstName: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:true,
      is: ["^[a-z]+$", 'i']
    }
  },
  studentLastName: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:true,
      is: ["^[a-z]+$", 'i']
    }
  },
  studentPassword: {
    type:Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: {
        args:[6,20],
        msg: "Password must be at least 6 characters long"
      }
    }
  }
});

var Instructor = connection.define ("Instructor", {
  instructorType: {
    type:Sequelize.STRING
  },
  instructorUsername: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlphanumeric: true
    }
  },
  instructorFirstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: ["^[a-z]+$", 'i']
    }
  },
  instructorLastName: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:true,
      is: ["^[a-z]+$", 'i']
    }
  },
  instructorPassword : {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: {
        args:[6,20],
        msg: "Password must be at least 6 characters long"
      }
    }
  }
});

Instructor.belongsTo(Student);
Student.sync();
Instructor.sync();
app.use(session({
  secret:"secret",
  cookie: {
    maxAge: 1000 * 60* 60
  },
  saveUninitialized: true,
  resave: false
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set("view engine", 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.get('/', function  (req, res) {
  res.render("home");
});

app.get('/student_register', function (req, res) {
  res.render("student_register");
});
app.get('/instructor_register', function (req, res) {
  res.render("instructor_register");
});
app.get('/student_login', function (req, res) {
  res.render("student_login");
});

app.post('/student_account', function (req, res) {
  var user = req.body
  Student.findOne({
    where:{
      studentUsername: req.body.studentUsername,
      studentPassword: req.body.studentPassword
    }
  }).then(function (user) {
    res.render('student_account', {user});
  })
});

app.get('/instructor_login',  function (req, res) {
  res.render('instructor_login');
})



app.post('/student_register', function (req ,res) {
  var username = req.body.studentUsername;
  var firstName = req.body.studentFirstName;
  var lastName = req.body.studentLastName;
  var password = req.body.studentPassword;

  Student.create({
    studentUsername: username,
    studentFirstName: firstName,
    studentLastName: lastName,
    studentPassword: password
  }).then(function (result) {
    res.send("<h1> Success </h1>");
  }).catch(function (err) {
    console.log(err);
    res.send("<h1> FAIL </h1>");
  });
});

app.post("/instructor_register", function (req, res) {
  var username = req.body.instructorUsername;
  var firstName = req.body.instructorFirstName;
  var lastName = req.body.instructorLastName;
  var password =req.body.instructorPassword;
  var type = req.body.instructorType;

  Instructor.create({
    instructorUsername: username,
    instructorFirstName: firstName,
    instructorLastName: lastName,
    instructorPassword: password,
    instructorType: type
  }).then(function (result) {
    res.send("<h1> Success </h1>");
  }).catch(function (err) {
    console.log(err);
    console.log(type);
    res.send("<h1> FAIL </h1>");
  });

});


app.listen(PORT, function () {
  console.log("lisetning on port %s", PORT);
});
