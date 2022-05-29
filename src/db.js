const mongoose = require("mongoose");
const DB_URI = "mongodb://localhost:27017/zen-spot";

//connect database

function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      mongoose.connect("mongodb://localhost:27017/unit-test-db"), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      };
      //log if theres an error to db connection and if db successfully connected
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "connection error:"));
      db.once("open", () => {
        console.log("test database connected");
      });
    } else {
      mongoose.connect(DB_URI), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      };
      //log if theres an error to db connection and if db successfully connected
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "connection error:"));
      db.once("open", () => {
        console.log("Database connected");
      });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  close
};