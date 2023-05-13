const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const pots = require("./api/pots");
const histories = require("./api/histories");
const verifies = require("./api/verifies");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Use Routes
// app.use("/api/user", users);
app.use("/api/pots", pots);
app.use("/api/histories", histories);
app.use("/api/verifies", verifies);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.json({ msg: "Server is running for Pick Or Rick" });
});

const port = process.env.PORT || require("./config/keys").port;

app.listen(port, () => console.log(`Server running on port ${port}`));
