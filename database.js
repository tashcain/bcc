// var mysql = require('mysql')

// var connection;

// function sqlConnector(){
// connection = mysql.createConnection(
//   {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'brahmanchamber'
// })
// return connection;
// }

// module.exports = { sqlConnector };

const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// create connection sql
var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
  timeout: 60000,
  port: 3306,
});

//connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql Connected");
});

module.exports = db;
