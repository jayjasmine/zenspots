const express = require("express");
const session = require("express-session");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const app = express();


const conn = require('./db');
conn.connect();

const admin = new User({
  email: "admin@admin.com",
  username: "admin",
  usertype: "admin",
});

const password = "admin";

async function createAdmin() {
  await User.deleteOne({
    username: 'admin'
  });
  console.log('existing admin user deleted');
  await User.register(admin, password);
  console.log(`New admin successfully created, u:${admin.username} pw:${password}`);
}

createAdmin();