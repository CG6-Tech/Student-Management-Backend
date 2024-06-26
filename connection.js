const oracledb = require('oracledb');

const dbConfig = require("./connection.config.json");


async function getConnection() {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error("Error establishing connection:", err);
    throw err;
  }
}

module.exports = { getConnection };
