const nodemailer = require("nodemailer");
async function sendEMail(to,subject,otp,msg) {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.email,
    pass: process.env.apppassword,
  },
});

const info = await transporter.sendMail({
   from: process.env.email,
    to,
    subject,
    text: `${msg}\n\nYour OTP is: ${otp}`,
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>${msg}</p>
    `,
  });
  return info
    
}
module.exports=sendEMail;