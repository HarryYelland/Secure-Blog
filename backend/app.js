// https://node-postgres.com/

var express = require("express");
const cors = require("cors");
var app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());
var nodemailer = require('nodemailer');

const { Client } = require('pg');

const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'computing',
  port: 5432,
});

// Function to add Salt to the user's password
function salt(rawPassword, saltVal){
  // Appends salt to user's password
  var saltedPassword = rawPassword + saltVal;
  return saltedPassword;
}

// Function to generate a Salt, ready to be stored in db/added to password
function generateSalt(){
  var salt = "";
  // gets 5 random chars from allChars constant
  for(let i=0; i<5; i++){
    salt += allChars.charAt(Math.floor(Math.random * allChars.length))
  }
  return salt;
}

// Function to add pepper to user's password
function pepper(rawPassword, pepperVal){
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
async function hash(rawPassword){
  //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const encoder = new TextEncoder();
  const data = encoder.encode(rawPassword);
  const hashedPassword = await crypto.subtle.digest("SHA-256", data);
  return hashedPassword;
}

function passwordGenerator(rawPassword){
  var improvedPassword = "";
  improvedPassword = salt(rawPassword, generateSalt);
  improvedPassword = pepper(improvedPassword, generatePepper);
  improvedPassword = hash(improvedPassword);
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
  crypto.getRandomValues(twoFaNum);
  let numtext = twoFaNum[0];
  console.log(numtext);
  return numtext;
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
  // await client.query(query, (err, res) => {
  //   //console.log(err, res);
  //   var result = res.rows;
  //   client.end();
  //   //console.log("Query result: ", res.rows[0]);
  //   //console.log(result);
  //   return result;
  // })

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
  dbQuery("INSERT INTO users (username, password, email, session, two_fa) VALUES ('" + req.body.username + "', '" + req.body.password + "', '" + req.body.email + "', 'Test_Session', 1)");
  console.log("User added!");
  res.send("User added!");
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
      db.query("SELECT username, password FROM posts WHERE username IN('" + request.body.username +"'");
    }
  })
})

sendEmail("dsssecureblogug13@hotmail.com", "1234");

app.listen(PORT, () => {
  console.log("Running Backend server on port ", PORT);
});

module.exports = app;
