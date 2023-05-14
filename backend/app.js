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

//https://www.makeuseof.com/prevent-cross-site-scripting-in-nodejs/
// Using httpOnly means that CSS attackers get empty string.
// app.use(express.session({
//     secret: "SecureFootballBlogDSS",
//     cookie: {
//       httpOnly: true,
//       secure: true
//     }
//   }))

const { Client } = require('pg');

const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

var testCount = 0;

var sessions = [];

function addSession(sessionid, userid){
  //check session not already added
  for(let i=0; i<sessions.length; i++){
    if(sessions[i][0] == sessionid){
      return null;
    }
  }
  let date = new Date();
  sessions.push([sessionid, userid, date])
}

function getSession(sessionid){
  let date = new Date();
  if(sessions[i][0] == sessionid){
    // found a match
    if(sessions[i][2] + 1500 < date){
      return sessions[i][1];
    } else {
      // if expired
      return false;
    }
  } else {
    return false
  }
}


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

function passwordChecker(rawPassword, salt){
  var passwordcheck = "";
  for(let i=0; i<allChars.length; i++){
    passwordcheck = addSalt(rawPassword, salt);
    passwordcheck = addPepper(passwordChecker, allChars.charAt(i));
    passwordcheck = addHash(passwordcheck);

    //Check password against db
    pool.connect(function(err, db, done) {
      if(err) {
        return response.status(400).send(err)
      } else {
        db.query("SELECT username FROM users WHERE password = '" + passwordcheck + "'", function(err, table) {
          done();
          if(err){
            return response.status(400).send(err);
          } else {
            return response.status(200).send(table.rows)
          }
        })
      }
    })  
  }
}

//SQLi Banned Phrases
//https://www.stackhawk.com/blog/node-js-sql-injection-guide-examples-and-prevention/
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
  'OR "="',
  '"="',
  "IF",
  "OR",
  "AND",
  "--",
  "=1"
];

// Cross Site Scripting Banned Phrases
// https://www.acunetix.com/websitesecurity/cross-site-scripting/
const illegalPhrases2 = [
  "SCRIPT",
  "<SCRIPT>",
  "<SCRIPT/>",
  "/>",
  "BODY",
  "<BODY>",
  "<BODY/>",
  "<BODY",
  "IMG",
  "<IMG>",
  "<IMG",
  "<IMG/>",
  "IFRAME",
  "<IFRAME>",
  "<IFRAME",
  "<IFRAME/>",
  "INPUT",
  "<INPUT>",
  "<INPUT/>",
  "<INPUT",
  "LINK",
  "<LINK>",
  "<LINK/>",
  "<LINK",
  "TABLE",
  "<TABLE>",
  "<TABLE/>",
  "<TABLE",
  "DIV",
  "<DIV>",
  "<DIV/>",
  "<DIV",
  "OBJECT",
  "<OBJECT>",
  "<OBJECT/>",
  "<OBJECT"
];

function antiSQLi(input) {
  var inputUpper = input.toUpperCase();
  var clean = true;
  for(let i=0, len=illegalPhrases.length; i<len; i++) {
    //https://www.stackhawk.com/blog/node-js-sql-injection-guide-examples-and-prevention/
    // checks that input is a string and not object etc.
    if(typeof input != "string"){
      clean = false;
    }

    if (inputUpper.includes(illegalPhrases[i])) {
      clean = false;
      console.log("SQL injection on " + input);
    }
  }
  return clean;
}

function antiCSS(input) {
  var inputUpper = input.toUpperCase();
  var clean = true;
  for(let i=0, len=illegalPhrases2.length; i<len; i++) {
    if(typeof input != "string"){
      clean = false;
    }

    if (inputUpper.includes(illegalPhrases2[i])) {
      clean = false;
      console.log("Cross-Site Scripting on " + input);
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

app.post("/duplicate-user", (req, res) => {
  //checks to see if username already taken
  pool.connect(function(err, db, done) {
    if(err) {
      return res.status(400).send(err)
    } else {
      db.query("SELECT username FROM users WHERE username = '" + req.body.username + "'", function(err, table) {
        done();
        if(err){
          return res.status(400).send(err);
        } else {
          res.send("User already exists")
          return res.status(400).send("User already exists");
        }
      })
    }
  })
  return "Creating User";
})

app.post("/add-user", (req, res) => {

  // generates salt for user
  let salt = generateSalt();

  // checks if sql injected
  if(antiSQLi(req.body.username) == false ||
    antiSQLi(req.body.password) == false ||
    antiSQLi(req.body.email) == false
  ){
    console.log("SQL Injection detected");
    return res.status(400).send(err);
  }

  if(antiCSS(req.body.username) == false ||
    antiCSS(req.body.email) == false
  ){
    console.log("Cross Site Scripting Detected");
    return res.status(400).send("CROSS SITE SCRIPTING DETECTED");
  }

  // inserts new user into db
  try {
    dbQuery("INSERT INTO users (username, password, email, session, two_fa, salt) VALUES ('"
  + req.body.username + "', '" + passwordGenerator(req.body.password, salt) + "', '" + req.body.email + "', '" + generateSessionId() + "', '" + gen2fa() + "', '" + salt + "')");
  } catch (error) {
    return "Username Already Taken"
  }
  //console.log("User added!");
  //res.send("User added!");
  return res;
});

app.post("/get-front", (req, res) => {
  console.log(req.body.front);
});

app.post("/check-session", (req, res) => {
  //console.log("called session check");
  //console.log("sessionid = " + req.body.session);
  if(req.body.session === "1"){
    console.log("returning true")
    res.send(true);
    return res;
  }
  res.send(false);
  return res;
}
);


app.post("/add-post", (req, res) => {
  if(antiSQLi(req.body.postTitle) == false ||
    antiSQLi(req.body.postText) == false    
  ){
    console.log("SQL Injection Detected");
    return res.status(400).send("SQL INJECTED");
  }

  if(antiCSS(req.body.postTitle) == false ||
    antiCSS(req.body.postText) == false
  ){
    console.log("Cross Site Scripting Detected");
    return res.status(400).send("CROSS SITE SCRIPTING DETECTED");
  }

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
  //SQLi prevention
  if(antiSQLi(req.body.username) == false ||
    antiSQLi(req.body.password) == false ||
    antiSQLi(req.body.email) == false
  ){
    console.log("SQL Injection detected");
    return res.status(400).send(err);
  }

  //Cross Site Scripting Prevention
  if(antiCSS(req.body.username) == false ||
    antiCSS(req.body.email) == false
  ){
    console.log("Cross Site Scripting Detected");
    return res.status(400).send("CROSS SITE SCRIPTING DETECTED");
  }

  pool.connect(function(err, db, done){
    if(err) {
      return response.status(400).send(err)
    }else{
      //db.query("UPDATE users SET two_fa = ('" gen2fa() '") WHERE username IN ('" + request.body.username" ))  <--- This line should add the 2fa to the corresponding record
      var email =  db.query("SELECT email FROM users WHERE username IN('" + request.body.username +"'");
      var twofa = db.query("SELECT two_fa FROM users WHERE username IN('" + request.body.username + "'");
      sendEmail(email, twofa)
      console.log("the email is" + email);
      console.log("the two_Fa is" + twofa);
    }
  })
})


//sendEmail("kingaj4ever@gmail.com", gen2fa());

app.listen(PORT, () => {
  console.log("Running Backend server on port ", PORT);
});

module.exports = app;

function testAntiSQLi(testmessage){
  var result = antiSQLi(testmessage);
  console.log("Test #" + testCount+":")
  console.log("Performing AntiSQLi test on '" +testmessage + "'");
  if(result == false){
    console.log("Detected SQL injection. (Clean = " + result + ")\n")
  } else {
    console.log("No SQL injection detected. Test Passed. (Clean = " + result + ")\n")
  }
  testCount += 1;
}

function testCSS(testmessage){
  var result = antiCSS(testmessage);
  console.log("Test #" + testCount+":")
  console.log("Performing Anti-Cross Site Scripting test on '" +testmessage + "'");
  if(result == false){
    console.log("Detected Cross Site Scripting. (Clean = " + result + ")\n")
  } else {
    console.log("No Cross Site Scripting detected. Test Passed. (Clean = " + result + ")\n")
  }
  testCount += 1;
}

// Test Harness for 
function testHarness(){
  console.log("Backend Running Test Harness");
  console.log("To Disable This, Please Comment Line 'testHarness();' out of code");
  console.log("-----------------------------------------------------------------");
  testCSS("no css");
  testCSS("<p/>")
  testCSS("embedded<script>var i=0;</script>css")
  testCSS("<p><script><script/><p/>");
  testAntiSQLi("no sqli");
  testAntiSQLi("select * from");
  testAntiSQLi("embeddedinsertstatement");
}

//testHarness();


function Enumeration(){ //Call this on failed login and include "error-message in HTML
  const errorMessage = document.getElementById('error-message'); 
  errorMessage.textContent = 'username or password is incorrect';
  const delay = Math.floor(Math.random() * 5000) + 1000;
  delay
}