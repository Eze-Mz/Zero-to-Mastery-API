const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const { response } = require("express");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "admin",
    database: "smartbrain",
  },
});

// use select with knex to de database
// console.log(
//   db
//     .select("*")
//     .from("users")
//     .then((data) => console.log(data))
// );

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Its working");
});

app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

/*
/ root route --> "this is working"
/signin --> POST = succes/fail
/register --> POST = return user
/profile/:userId --> GET = user
/image --> PUT = return updated count
*/
