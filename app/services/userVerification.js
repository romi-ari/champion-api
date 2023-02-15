/**
* @file contains service champion 
*/

const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer")
const userVerification = require("../repositories/userVerification")
const dotenv = require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
})

async function sendVerificationEmail(req, res) {
  try {
    const verification_token = uuidv4();
    const verification_expires = new Date(Date.now() + 60 * 60 * 1000);
    const email = req.user.email

    if(email !== req.user.email) {
      return {
        response: 403,
        status: "FAIL",
        message: "Email not match",
      }
    }
    
    const user = await userVerification.update(req.user.id, {
      verification_token,
      verification_expires,
    });

    const mailOption = {
      from: "Champion API" + process.env.email,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Hi ${email},</p>
      <p>Please click the following link to verify your email:</p>
      <p><a href="http://localhost:8000/verify-email/${verification_token}">http://localhost:8000/verify-email/${verification_token}</a></p>
      <p>The link will expire in one hour.</p>
      `
    }

    await transporter.sendMail(mailOption)

    return{user}

  } catch (err) {
    return{
      response: 400,
      status: "FAIL",
      message: "An error has occured",
      error: err.message
    };
  }
  
}

async function verifyEmail(req) {
  try {
    
    const expired = req.user.verification_expires

    if(expired < new Date()) {
      return{
        response: 410,
        status: "FAIL", 
        message: 'Verification token is invalid or has expired.',
      }
    }
  
    const verified = true

    const verify = await userVerification.update(req.user.id, {
      verified,
    })

    return{verify}

  } catch (err) {
    return{
      response: 400,
      status: "FAIL",
      message: "An error has occured",
      error: err.message
    };
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
};