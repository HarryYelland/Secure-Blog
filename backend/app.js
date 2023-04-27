// https://node-postgres.com/

var express = require("express");
const cors = require("cors");
var app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());
var nodemailer = require('nodemailer');

const { Pool, Client } = require('pg');
 

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
  dbQuery("INSERT INTO posts (post_title, post_body, author, is_private) VALUES ('" + req.body.postTitle + "', '" + req.body.postText + "', 1, FALSE)");
  console.log("Post added!");
  res.send("Post added!");
  return res;
});

app.get("/all-posts", (req, res) => {
  var query = dbQuery("SELECT * FROM posts")
  var result = [];

  

  result.push(query);
  res.send(result);

  return result;
});

sendEmail("harryyelland@gmail.com", "1234");

app.listen(PORT, () => {
  console.log("Running Backend server on port ", PORT);
});

module.exports = app;
