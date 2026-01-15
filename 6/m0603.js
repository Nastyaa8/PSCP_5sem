const nodemailer = require('nodemailer');

const FIXED_TO = 'nastya.solenok.06@mail.ru';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: FIXED_TO,
    pass: 'HEKsPjiEjlbCZ80rZ6IG'
  }
});


function send(messageText) {
  const mailOptions = {
    from: FIXED_TO,
    to: FIXED_TO,
    subject: 'm0603',
    html: `<p>${messageText}</p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Ошибка :', err);
    } else {
      console.log('Письмо отправлено:', info.response);
    }
  });
}

module.exports = { send };
