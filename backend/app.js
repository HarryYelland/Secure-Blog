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
  //pre-expired so user will have to go through 2fa authentication
  let date = new Date(Date.now());
  date.setMinutes(date.getMinutes() - 30);
  sessions.push([sessionid, userid, date])
}


function getSession(sessionid){
  console.log("checking session " + sessionid + " against " + sessions[0][0]);
  let date = new Date(Date.now());
  for(let i=0; i<sessions.length; i++){
    if(sessions[i][0] == sessionid){
      // found a match
      console.log(session[i][2]);
      if(sessions[i][2] > date){
        return true;
      } else {
        //send user back to 2fa auth if session expired
        return "auth";
      }
    }
  }
  return false;
}

function findSession(userid){
  for(let i=0; i<sessions.length; i++){
    if(sessions[i][1] == userid){
      return sessions[i][0];
    }
  }
  return -1;
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

app.post("/check-session", (req, res) => {
  var newSession = req.body.session;
  if(getSession(newSession) === true){
    console.log("returning true")
    res.send(true);
    return res;
  } else if (getSession(newSession) === "auth"){
    res.send("auth");
    return res;
  }
  res.send(false);
  return res;
}
);

//addSession(generateSessionId(), 1)
console.log("///");
console.log(sessions);

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
  console.log("generating salt")
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
    passwordcheck = addPepper(passwordcheck, allChars.charAt(i));
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

// Function for checking if SQL has been injected into user input
function antiSQLi(input) {
  //converts the input to uppercase to limit test cases
  var inputUpper = input.toUpperCase();
  // create a variable to measure if clean input
  var clean = true;
  //loop through all the illegal phrases (SQL keywords) to check if any phrases used in input
  for(let i=0, len=illegalPhrases.length; i<len; i++) {
    // checks that input is a string and not object etc.
    if(typeof input != "string"){
      // if its not a string, set clean to false so that it isn't processed
      clean = false;
    }
    // if an illegal phrase is found
    if (inputUpper.includes(illegalPhrases[i])) {
      // set clean to false so that it isn't processed
      clean = false;
      // output to console that sql injection has been found
      // also output the query so that any system admins can use this for insights as part of sqli prevention methods/monitoring
      console.log("SQL injection on " + input);
    }
  }
  // return the cleanliness rating (if true okay to process, if false reject and do not process)
  return clean;
}

//Function to check if cross-site scripting has been injected into input
function antiCSS(input) {
    //converts the input to uppercase to limit test cases
  var inputUpper = input.toUpperCase();
  // create a variable to measure if clean input
  var clean = true;
  //loop through all the illegal phrases (scripting tags/phrases) to check if any phrases used in input
  for(let i=0, len=illegalPhrases2.length; i<len; i++) {
    // checks that input is a string and not object etc.
    if(typeof input != "string"){
      // if its not a string, set clean to false so that it isn't processed
      clean = false;
    }

    // if an illegal phrase is found
    if (inputUpper.includes(illegalPhrases2[i])) {
      // set clean to false so that it isn't processed
      clean = false;
      // output to console that cross-site scripting has been found
      // also output the script to the console so that any system admins can use this for insights as part of css prevention methods/monitoring
      console.log("Cross-Site Scripting on " + input);
    }
  }
  // return the cleanliness rating (if true okay to process, if false reject and do not process)
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
    .catch(err => {return err});

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
    antiSQLi(req.body.password) == false
  ){
    //if injected, returns error
    console.log("SQL Injection detected");
    return res.status(400).send("SQL injection detected");
  }

  // checks if cross site scripting injected
  if(antiCSS(req.body.username) == false ||
    antiCSS(req.body.email) == false
  ){
    //if injected, returns error
    console.log("Cross Site Scripting Detected");
    return res.status(400).send("CROSS SITE SCRIPTING DETECTED");
  }

  // inserts new user into db
  try {
    dbQuery("INSERT INTO users (username, password, email, session, two_fa, salt) VALUES ('"
  + req.body.username + "', '" + passwordGenerator(req.body.password, salt) + "', '" + req.body.email + "', '" + generateSessionId() + "', '" + gen2fa() + "', '" + salt + "')");
  console.log("getting id");

  var id = -1;
  //id = await dbQuery("SELECT user_id FROM users WHERE username = '" + req.body.username + "'");
  pool.connect(function(err, db, done) {
    if(err) {
      return null;
    } else {
      db.query("SELECT user_id FROM users WHERE username = '" + req.body.username + "'", function(err, table) {
        done();
        if(err){} else {
          //console.log(table.rows);
          id = table.rows[0].user_id;
          addSession(generateSessionId(), id);
          console.log("sessions");
          console.log(sessions)
          var sessionid = findSession(id);
          console.log("sessionid = " + sessionid);
          res.send(sessionid);
          return sessionid;
        }
      })
    }
  })
  } catch (error) {
    //res.send("Username Already Taken");
    return "Username Already Taken"
  }


  //console.log("User added!");
  //res.send("User added!");
  ////return res;
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

  var privacy = "FALSE"
  if (req.body.privacy == "private"){
    console.log("TRUE");
    privacy = "TRUE"
  } else {
    console.log("FALSE")
    privacy = "FALSE"
  };

  dbQuery("INSERT INTO posts (post_title, post_body, author, is_private) VALUES ('" + req.body.postTitle + "', '" + req.body.postText + "', 2, '"+privacy+"')");
  console.log("Post added!");
  res.send("Post added!");
  return res;
});


app.get('/search-posts', async function(req, res) {
  try {
    const { search } = req.query;

    if(antiSQLi(search) === false || antiCSS(search) === false){
      console.log("SQL/CSS Injected Query: " + search);
      console.log("Returning Blanked Results")
      res.json([{"post_id": "SQL/CSS Injected", "post_title": "Please Try Again", "post_body": "", "username": ""}])
    } else {
      const posts = await pool.query(
        "SELECT post_id, post_title, post_body, users.username FROM posts LEFT JOIN users ON posts.author = users.user_id WHERE post_title ILIKE $1 AND is_private = FALSE",
        [`%${search}%`]
      )
      //console.log(posts.rows)
      res.json(posts.rows)
    }
  } catch (error) {
    console.error(error.message)
  }
})

app.get('/all-posts', async function(req, res) {
  try {
    const posts = await pool.query(
      "SELECT post_id, post_title, post_body, users.username FROM posts LEFT JOIN users ON posts.author = users.user_id WHERE is_private = FALSE")
    res.json(posts.rows)
  } catch (error) {
    console.error(error.message)
  }
})

app.get('/post', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err);
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

app.get('/my-posts', async function(request, response) {
  try {
    const { session } = req.query;
    const userid = findSession(session)

    const posts = await pool.query(
      "SELECT post_id, post_title, post_body, users.username FROM posts LEFT JOIN users ON posts.author = users.user_id WHERE user.user_id = $1",
      [`%${userid}%`]
    )

    res.json(posts.rows)
  } catch (error) {
    console.error(error.message)
  }
})

app.get('/login-user', async function(req, res){
  try {
    const user = req.query.user;
    const pass = req.query.pass; 

    const getPass = "SELECT password FROM users WHERE username = '" + user + "'";
    const getSalt = "SELECT salt FROM users WHERE username = '" + user + "'";
    const getId = "SELECT user_id FROM users WHERE username = '" + user + "'";

    if(antiSQLi(user) === false || antiCSS(user) === false ||
    antiSQLi(pass) === false || antiCSS(pass) === false
    ){
      console.log("SQL/CSS Injected Query: " + user + pass);
      console.log("Returning Blanked Results")
    } else {
      const password = await pool.query(getPass);
      const salt = await pool.query(getSalt);
      const id = await pool.query(getId);

      var correct = false;
      var passwordcheck = "";
      for(let i=0; i<allChars.length; i++){
        passwordcheck = addSalt(password, salt);
        passwordcheck = addPepper(passwordcheck, allChars.charAt(i));
        passwordcheck = addHash(passwordcheck);
        //console.log(passwordcheck);
        if(passwordcheck === password.rows[0].password){
          correct = true;
          console.log("Correct Password Found")
        }
      }
      if(correct === false){
        res.json({"message": "User Details Incorrect. Please try again.", "session": ""});
      } else {
        var session = generateSessionId();
        addSession(session, id);
        res.json({"message": "", "session": session});
      }
    }
  } catch (error) {
    console.error(error.message)
  }
});



app.get('/log-use', function (request, response){
  alert("success");
    });


//sendEmail("kingaj4ever@gmail.com", gen2fa());

app.post('/check-2fa', function(req, res){
  var session = req.body.session;
  var id = -1;
  //SQLi prevention
  if(antiSQLi(req.body.code) === false ||
  antiSQLi(session === false)
  ){
    console.log("SQL Injection detected");
    return res.status(400).send(err);
  }

  //Cross Site Scripting Prevention
  if(antiCSS(req.body.code) == false ||
  antiCSS(session === false)
  ){
    console.log("Cross Site Scripting Detected");
    return res.status(400).send("CROSS SITE SCRIPTING DETECTED");
  }

  for(let i=0; i<sessions.length; i++){
    if(sessions[i][0] == sessionid){
      // found a match
      //console.log(session[i][2]);
      id = session[i][1];
    }
  }

  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err)
    } else {
      db.query("SELECT two_fa FROM users WHERE user_id = '" + id + "'", function(err, table) {
        done();
        console.log(response);
        if(table.rows[0].two_fa === req.body.code){
          for(let i=0; i<sessions.length; i++){
            console.log("code matches")
            let date = new Date(Date.now());
            date.setMinutes(date.getMinutes() + 30);
            if(sessions[i][0] == sessionid){
              session[i][2] = date;
            }
          }
        }
      })
    }
  })


})

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