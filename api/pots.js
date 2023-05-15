const express = require("express");
const router = express.Router();

// Pot model
const Pot = require("../models/Pot");

// @route   GET api/pots/status
// @desc    Pots starting status
// @access  Public
router.get("/status", (req, res) => {
  const timezone = "Europe/Paris";

  // get the current time in the GMT+1 timezone
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  console.log(new Date());
  res.json({ msg: "success" });
});

// @route   POST api/pots/create
// @desc    Create new Pot
// @access  Public
router.post("/create", (req, res) => {
  const timezone = "Europe/Paris";

  // get the current time in the GMT+1 timezone
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  const newPot = new Pot({
    created_at: new Date(currentTime),
  });

  newPot
    .save()
    .then((pot) => {
      res.json(pot);
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
