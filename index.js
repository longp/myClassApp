var express = require("express");
var exphbs = require("express-handlebars");
var Sequelize = require("sequelize");
var bodyParser = require("body-parser");
var session = require('express-session');
var app = express();
const PORT = 3000;
var connection = new Sequelize('class_db', 'root', '');


var Students = connection.define('Student', {
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

var Instructors = connection.define ("Instructor", {
  instructorType: {
    type:Sequelize.STRING,
    validate: {
      equals: 'TA' || 'Teacher'
    }
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

Instructors.belongsTo(Students);

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


app.get('/', function  (req, res) {
  res.render("home")
});

app.post('/register', function (req, res) {

})


app.listen(PORT, function () {
  console.log("lisetning on port %s", PORT);
});
