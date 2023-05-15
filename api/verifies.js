const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// Verify model
const Verify = require("../models/Verify");

// Generate random string by length
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// @route   POST api/verifies/send-mail
// @desc    Send verify code to mail
// @access  Public
router.post("/send-mail", (req, res) => {
  const timezone = "Europe/Paris";

  // get the current time in the GMT+1 timezone
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  // Get Verifycode
  var code = generateRandomString(6);

  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "Gmail",
      auth: {
        user: "stanislav.kogutstt2@gmail.com",
        pass: "phlbvyefyuiddptp",
      },
    })
  );

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "stanislav.kogutstt2@gmail.com", // sender address
    to: req.body.useremail, // list of receivers
    subject: "Verify Code", // Subject line
    html:
      `<html>
      <body>
        <div>
          Verification Link
          <p style="font-size: 32px; font-weight: bolder">
            <a
              href="http://localhost:3000/verify-email?code=` +
      code +
      `"
              target="_blank"
              style="
                text-decoration: none;
                color: #fff;
                background: rgb(73, 144, 0);
                font-size: 24px;
                padding: 20px 30px;
                border-radius: 10px;
              "
            >
              Verification
            </a>
          </p>
        </div>
      </body>
    </html>`,
  };

  // send mail with defined transport object
  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send({ error: "Something wrong!" });
      console.log(error);
    } else {
      console.log("Suceess");
      const newVerify = new Verify({
        useremail: req.body.useremail,
        code: code,
        created_at: new Date(currentTime),
      });

      newVerify
        .save()
        .then((verify) => {
          res.json({ msg: "Code sent success!" });
        })
        .catch((err) => res.status(404).json(err));
    }
  });
});

// @route   POST api/verifies/confirm
// @desc    Save verify history
// @access  Public
router.post("/confirm", (req, res) => {
  Verify.find()
    .sort({ created_at: -1 })
    .limit(1)
    .then((verify) => {
      if (verify[0].code === req.body.code) {
        res.json({ msg: "success" });
      } else {
        res.json({ msg: "error" });
      }
    })
    .catch((err) => {
      res.status(404).json({ msg: err });
    });
});

module.exports = router;
