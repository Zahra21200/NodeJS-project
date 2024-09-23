const nodemailer = require("nodemailer");
const emailTemplate = require("./emailTemplate.js");

async function sendemail(option, url) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "fatmamohamed2101@gmail.com",
      pass: "eyvh vtzr uqwv gbvn",
    },
  });

  const info = await transporter.sendMail({
    from: '"Zahra Othman" <fatmamohamed2101@gmail.com>',
    to: option,
    subject: "Hello ✔",
    text: "Hello world?",
    html: emailTemplate(option, url),
  });

  console.log("Message sent: %s", info.messageId);
}

async function resetpassword(option, url) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "fatmamohamed2101@gmail.com",
      pass: "eyvh vtzr uqwv gbvn",
    },
  });

  const info = await transporter.sendMail({
    from: '"resetpassword" <fatmamohamed2101@gmail.com>',
    to: option,
    subject: "resetpassword",
    text: "resetpassword",
    html: emailTemplate(url),
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = {
  sendemail,
  resetpassword,
};
