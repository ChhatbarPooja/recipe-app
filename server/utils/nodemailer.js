// config/nodemailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pooja.karavyasolutions@gmail.com', // Your email
    pass: 'Pooja@123'
  }
});

export default transporter;
