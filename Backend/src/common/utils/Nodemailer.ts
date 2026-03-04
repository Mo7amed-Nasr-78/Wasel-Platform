import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const SendMail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: 'Wasel_platform',
    to,
    subject,
    html,
  });
};
