const {Db} = require('pg')

const db = new Db({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "computing",
    database: "postgres"
})

db.connect();

//db.query("SELECT BLAH BLAH BLAH", (err, response)=>{
//  if (err){
//      console.log(err)
//  }
//
//    db.end;
// })