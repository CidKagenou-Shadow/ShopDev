const mongoose = require("mongoose");
const databaseType = require("./type.databases");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    Database.instance = mongoose
      .connect(MONGODB_URL)
      .then((conn) => {
        console.log("Connected database !");
        console.log("Database name:", conn.connection.name);
        return conn;
      })
      .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      new Database();
    }
    return Database.instance;
  }
}

const connection = Database.getInstance();
module.exports = connection;
