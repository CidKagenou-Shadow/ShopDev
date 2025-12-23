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

        conn.connection.db.admin()
        .command({ isMaster: 1 })
        .then((info) => {
          console.log("Mongo node:", info.me);
          console.log("Is primary:", info.ismaster);
          console.log("Is secondary:", info.secondary);
        })
        .catch((err) => {
          console.log("Error get DB info:", err);
        });
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
