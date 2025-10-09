const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD, // Gmail app password
    },
});

async function sendRegistrationConfirmation(to, firstName) {
    const mailOptions = {
        from: `"YCP Hacks" <${process.env.APP_EMAIL}>`,
        to,
        subject: 'Welcome to YCP Hacks!',
        html: `
      <h2>Hi ${firstName},</h2>
      <p>Thanks for registering for YCP Hacks!</p>
      <p>We’re excited to have you join us! Visit the YCP Hacks website to stay up-to-date on event details and announcements.</p>
      <br>
      <p>- The YCP Hacks Team</p>
      <img src="cid:logo" alt="YCP Hacks Logo" style="width: 120px; margin-bottom: 20px;">
    `,
        attachments: [
            {
                filename: 'ycphacks_logo.png',
                path: path.join(__dirname, '../assets/ycphacks_logo.png'),
                cid: 'logo'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendRegistrationConfirmation };