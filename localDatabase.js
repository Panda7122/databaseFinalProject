const fs = require("fs").promises;
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(
  "./TosDatabase.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error opening database " + err.message);
    } else {
      console.log("Database connected!");
    }
  }
);
/*const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Database connected!');
    }
});*/

// Function to establish a database connection
function connectToDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      "./TosDatabase.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("Error opening database " + err.message);
          reject(err);
        } else {
          console.log("Database connected!");
          resolve(db);
        }
      }
    );
  });
}

function executeSqlFile(filePath) {
  return fs.readFile(filePath, "utf8").then(
    (data) =>
      new Promise((resolve, reject) => {
        db.exec(data, (err) => {
          if (err) {
            console.error(`Error executing SQL from ${filePath}`, err);

            reject(err);
          } else {
            console.log(`Executed SQL from ${filePath} successfully`);
            resolve();
          }
        });
      })
  );
}

// Helper function to perform a SQL query
function performQuery(sql, param) {
  return new Promise((resolve, reject) => {
    db.all(sql, param, (err, rows) => {
      if (err) {
        console.error("Error executing query: ", err);
        reject(err);
      } else {
        console.log(`Using localDatabase.js`);
        console.log(`Query successful: ${sql}`);
        console.log(`Number of lines: ${rows.length}`);
        // console.log("Results:", rows);
        resolve(rows);
      }
    });
  });
}

// Function to execute a SQL query and print results
function executeQuery(sql, param) {
  return new Promise((resolve, reject) => {
    if (!db) {
      // Check if the database connection is not initialized
      connectToDatabase()
        .then(() => {
          performQuery(sql, param).then(resolve).catch(reject);
        })
        .catch(reject);
    } else {
      //show db is connected
      console.log("Database connected!");
      performQuery(sql, param).then(resolve).catch(reject);
    }
  });
}

async function runScripts() {
  try {
    await executeSqlFile("data/sqliteDDL.sql"); //Init the database if it doesn't exists
    await executeSqlFile("data/delete_relations.sql");
    await executeSqlFile("data/insert.sql");
    // Example query
    await executeQuery("SELECT * FROM tag"); // Replace 'tablename' with your actual table name
  } catch (err) {
    console.error("Failed to execute scripts", err);
  }
  /*finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database', err);
      } else {
        console.log('Database connection closed.');
      }
    });
    }*/
}

module.exports = { executeQuery, db, runScripts };
//runScripts(); //run this line ONLY when you need to update the database
// 確保導出 executeQuery

executeSqlFile("data/foreign.sql");
