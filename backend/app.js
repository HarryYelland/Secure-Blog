// https://node-postgres.com/

var express = require("express");
const cors = require("cors");
var app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());

const { Pool, Client } = require('pg');
 
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'computing',
  port: 5432,
});

client.connect();
 
function dbQuery(query) {
  console.log("Querying database: ", query);
  client.query(query, (err, res) => {
    console.log(err, res);
    client.end();
    return res;
  })
}

app.post("/add-post", (req, res) => {
  dbQuery("INSERT INTO posts (post_title, post_body, author, is_private) VALUES ('" + req.body.postTitle + "', '" + req.body.postText + "', 1, FALSE)");
  console.log("Post added!");
  res.send("Post added!");
  return res;
});

app.listen(PORT, () => {
  console.log("Running Backend server on port ", PORT);
});

module.exports = app;
