// https://node-postgres.com/

var express = require("express");
const cors = require("cors");
var app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const webcrypto = require('crypto').webcrypto;

const { Client } = require('pg');

const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

var sessions = [];

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'computing',
  port: 5432,
});

// Function to add Salt to the user's password
function addSalt(rawPassword, saltVal){
  // Appends salt to user's password
  var saltedPassword = rawPassword + saltVal;
  return saltedPassword;
}

// Function to generate a Salt, ready to be stored in db/added to password
function generateSalt(){
  var salt = "";
  // gets 5 random chars from allChars constant
  for(let i=0; i<5; i++){
    var pos = Math.floor(Math.random() * allChars.length);
    console.log(pos);
    salt += allChars.charAt(pos);
    console.log(salt);
  }
  return salt;
}

//generateSalt();

// Function to add pepper to user's password
function addPepper(rawPassword, pepperVal){
  var pepperedPassword = "";
  // Peppers before and after just to be slightly different from potential other systems
  pepperedPassword = pepperVal + rawPassword + pepperVal;
  return pepperedPassword;
}

// Function generate a pepper by selecting a random character from the array
function generatePepper(){
  var pepper = allChars.charAt(Math.floor(Math.random * allChars.length))
  return pepper;
}

// Function to hash the user's password
function addHash(rawPassword){
  //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  // const encoder = new TextEncoder();
  // const data = encoder.encode(rawPassword);
  // const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // const hashHex = hashArray
  //   .map((b) => b.toString(16).padStart(2, "0"))
  //   .join(""); // convert bytes to hex string

  //https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
  // only hexadecimal digits
  var hash = crypto.getHashes();
  //console.log(hash);
  hashPwd = crypto.createHash('sha256').update(rawPassword).digest('hex');
  return hashPwd;
}

function passwordGenerator(rawPassword, salt){
  var improvedPassword = "";
  improvedPassword = addSalt(rawPassword, salt);
  improvedPassword = addPepper(improvedPassword, generatePepper);
  improvedPassword = addHash(improvedPassword);
  return improvedPassword;
}

function passwordChecker(rawPassword, pepper){

}


const illegalPhrases = [
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "CREATE",
  "ALTER",
  "TRUNCATE",
  "TABLE",
  "DATABASE",
  "FROM",
  "WHERE",
  "INTO",
  "VALUES",
  "ORDER",
];

function antiSQLi(input) {
  var inputUpper = input.toUpperCase();
  var clean = true;
  for(let i=0, len=illegalPhrases.length; i<len; i++) {
    if (inputUpper.includes(illegalPhrases[i])) {
      clean = false;
      console.log("SQL injection on " + input);
    }
  }
  return clean;
}
 

function sendEmail(email, code){
// Using resources found at https://www.w3schools.com/nodejs/nodejs_email.asp
  var transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: 'dsssecureblogug13@hotmail.com',
      pass: 'Computing1!'
    }
  });
  
  var mailOptions = {
    from: 'dsssecureblogug13@hotmail.com',
    to: email,
    subject: 'Your 2FA code',
    text: 'Your 2FA code is ' + code + '.'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function gen2fa(){
  const twoFaNum = new Uint16Array(1);
  webcrypto.getRandomValues(twoFaNum);
  let numtext = twoFaNum[0];
  console.log(numtext);

  return numtext;
}

function generateSessionId(){
  var idtext = "";
  // gets 25 random chars from allChars constant
  for(let i=0; i<25; i++){
    var pos = Math.floor(Math.random() * allChars.length);
    idtext += allChars.charAt(pos);
  }
  session = crypto.getHashes();
  sessionid = crypto.createHash('sha256').update(idtext).digest('hex');
  //console.log(numtext);
  return sessionid;
}
 
function dbQuery(query) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'computing',
    port: 5432,
  });
  
  client.connect();
  console.log("Querying database: ", query);
    client
      .query(query)
      .then(res => {
        console.log(res.rows)
        client.end()
        return res.rows;
      })
    .catch(err => console.error(err.stack));

}

app.post("/add-user", (req, res) => {

  // generates salt for user
  let salt = generateSalt();

  // checks if sql injected
  if(antiSQLi(req.body.username) == false ||
    antiSQLi(req.body.password) == false ||
    antiSQLi(req.body.email) == false
  ){
    console.log("SQL Injection detected");
    return response.status(400).send(err);
  }

  //checks to see if username already taken
  // dbQuery("SELECT username FROM users WHERE username = '" + req.body.username + "'" , function(err, table) {
  //   done();
  //   console.log("table length " + table.length);
  //   if(table !== []){
  //     console.log("Username already taken");
  //     return response.status(400).send(err);
  //   }
  // });


  // inserts new user into db
  dbQuery("INSERT INTO users (username, password, email, session, two_fa, salt) VALUES ('"
  + req.body.username + "', '" + passwordGenerator(req.body.password, salt) + "', '" + req.body.email + "', '" + generateSessionId() + "', '" + gen2fa() + "', '" + salt + "')");
  
  //console.log("User added!");
  //res.send("User added!");
  return res;
});

app.post("/add-post", (req, res) => {
  dbQuery("INSERT INTO posts (post_title, post_body, author, is_private) VALUES ('" + req.body.postTitle + "', '" + req.body.postText + "', 4, FALSE)");
  console.log("Post added!");
  res.send("Post added!");
  return res;
});

app.get('/all-posts', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err)
    } else {
      db.query('SELECT post_id, post_title, post_body, username FROM posts LEFT JOIN users ON users.user_id = posts.author WHERE is_private = FALSE ORDER BY post_id DESC', function(err, table) {
        done();
        if(err){
          return response.status(400).send(err);
        } else {
          return response.status(200).send(table.rows)
        }
      })
    }
  })
})

app.get('/post', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err)
    } else {
      db.query("SELECT post_id, post_title, post_body, username FROM posts LEFT JOIN users ON users.user_id = posts.author WHERE post_id = '" + request.body.postid + "'", function(err, table) {
        done();
        if(err){
          return response.status(400).send(err);
        } else {
          return response.status(200).send(table.rows)
        }
      })
    }
  })
})

app.get('/my-posts', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err)
    } else {
      // Change the user_id later when this is implemented
      db.query('SELECT post_id, post_title, post_body, username FROM posts LEFT JOIN users ON users.user_id = posts.author WHERE user_id = 1 ORDER BY post_id DESC', function(err, table) {
        done();
        if(err){
          return response.status(400).send(err);
        } else {
          return response.status(200).send(table.rows)
        }
      })
    }
  })
})

app.get('/login-user', function(request, response){
  pool.connect(function(err, db, done){
    if(err) {
      return response.status(400).send(err)
    }else{
     var email =  db.query("SELECT email FROM users WHERE username IN('" + request.body.username +"'");
     var twofa = db.query("SELECT two_fa FROM users WHERE username IN('" + request.body.username + "'");
     sendEmail(email, twofa)
     console.log(email);
     console.log(twofa);
    }
  })
})

sendEmail("dsssecureblogug13@hotmail.com", "1234");

app.listen(PORT, () => {
  console.log("Running Backend server on port ", PORT);
});

module.exports = app;

function Enumeration(){ //Call this on failed loggin and include "error-message in HTML
  const errorMessage = document.getElementById('error-message'); 
  errorMessage.textContent = 'username or password is incorrect';
  const delay = Math.floor(Math.random() * 5000) + 1000;
  delay
}