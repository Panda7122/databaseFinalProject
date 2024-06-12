const fs = require("fs").promises;
const mysql = require("mysql");
const path = require("path");

const con = mysql.createConnection({
  host: "140.122.184.129",
  user: "team2",
  password: "B6rV8-eyoaplDz[f",
  port: 3310,
  database: "team2",
  connectTimeout: 10000, // 10 seconds
});
//Function to establish a database connection
function connectToDatabase() {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        console.error("Error connecting to the database " + err.message);
        reject(err);
      } else {
        console.log("Database connected!");
        resolve(con);
      }
    });
  });
}
// async function connectToDatabase(){
//   con.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to the remote database!');
//   });
// }

function executeSqlFile(filePath) {
  return fs.readFile(filePath, "utf8").then(
    (data) =>
      new Promise((resolve, reject) => {
        con.query(data, (err, results) => {
          if (err) {
            console.error(`Error executing SQL from ${filePath}`, err);
            reject(err);
          } else {
            console.log(`Executed SQL from ${filePath} successfully`);
            resolve(results);
          }
        });
      })
  );
}

// Helper function to perform a SQL query
function performQuery(sql, param) {
  return new Promise((resolve, reject) => {
    con.query(sql, param, (err, results) => {
      if (err) {
        console.error("Error executing query: ", err);
        reject(err);
      } else {
        console.log(`Using database.js`);
        console.log(`Query successful: ${sql}`);
        console.log(`Number of rows: ${results.length}`);
        console.log(results); // 假如資料太多可以註解一下以便測試
        resolve(results);
      }
    });
  });
}

// Function to execute a SQL query and print results
function executeQuery(sql, param) {
  return new Promise((resolve, reject) => {
    if (!con) {
      // Check if the database connection is not initialized
      connectToDatabase()
        .then(() => {
          performQuery(sql, param).then(resolve).catch(reject);
        })
        .catch(reject);
    } else {
      // Show db is connected
      console.log("Database connected!");
      performQuery(sql, param).then(resolve).catch(reject);
    }
  });
}

async function runScripts() {
  try {
    await connectToDatabase();
    await executeSqlFile(path.join('data', 'MYDDL.sql')); // Create the database and tables

    // const cardRows = await executeQuery("SELECT COUNT(*) AS count FROM card");
    // if (cardRows[0].count === 0) {
    await executeSqlFile(path.join("data", "insert.sql")); // Insert initial data
    console.log("Inserted initial data.");
    // } else {
    //   console.log('The table "card" is not empty. Skipping data insertion.');
    // }

    // Example query
    await executeQuery("SELECT * FROM tag"); // Replace 'tag' with your actual table name
  } catch (err) {
    console.error("Failed to execute scripts", err);
  }
  // finally {
  //   con.end((err) => {
  //     if (err) {
  //       console.error('Error closing database connection', err);
  //     } else {
  //       console.log('Database connection closed.');
  //     }
  //   });
  // }
}

module.exports = { executeQuery, con, runScripts };
// runScripts(); // Run this line ONLY when you need to update the database
