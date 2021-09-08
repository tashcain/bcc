var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chirag.evrenglobalsolutions@gmail.com",
    pass: "kendriyavidyalaya",
  },
});

module.exports = { transporter };
