const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

function setEmailOptions(options) {
  return {
    from: 'tom zacchia <tomzacchia@live.com>',
    to: options.recipientEmail,
    subject: options.subject,
    text: options.message
    // html:
  };
}

const sendEmail = async options => {
  const transporter = createTransporter();

  const emailOptions = setEmailOptions(options);

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
