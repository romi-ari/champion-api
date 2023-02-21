/**
 * @file contains service champion
 */

const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userVerification = require("../repositories/userVerification");
const dotenv = require("dotenv");
dotenv.config();

const encryptPassword = (password) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, parseInt(process.env.salt), (err, encryptedPassword) => {
        if (!!err) {
          reject(err);
          return;
        }

        resolve(encryptedPassword);
      });
    });
  } catch (error) {
    res.status(400).json({
      status: "FAIL",
      message: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

async function sendVerificationEmail(req) {
  try {
    const tokenUUID = uuidv4()
    const expiresOn = new Date(Date.now() + 1800000);
    const id = req.user.id
    
    const token = userVerification.createTokenSendVerifyEmail({
      id,
      tokenUUID, 
      expiresOn, 
    })

    const verify_email_token = token
    const verification = await userVerification.create({verify_email_token})

    const email = req.user.email

    const mailOption = {
      from: "Champion API" + process.env.email,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Hi ${email},</p>
      <p>Please click the following link to verify your email:</p>
      <p><a href="http://localhost:8000/verify-email/${verify_email_token}">http://localhost:8000/verify-email/${verify_email_token}</a></p>
      <p>The link will expire in thirty minutes.</p>
      `,
    };

    await transporter.sendMail(mailOption)
  
    return {verification}

  } catch (err) {
    return {
      response: 400,
      status: "FAIL",
      message: "An error has occured",
      error: err.message,
    };
  }
}

async function verifyEmail(req) {
  try {

    const bearerToken = req.headers.authorization
    const token = bearerToken.split("Bearer ")[1]
    const tokenPayload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY)

    const verify_email_token = req.params.verify_email_token
    const isFound = await userVerification.findEmailToken(verify_email_token)

    if (!isFound) {
      return {
        response: 400,
        status: "FAIL",
        message: "Token do not match or invalid",
      };
    }

    const expired = tokenPayload.expiresOn;

    if (expired <= new Date()) {
      return {
        response: 410,
        status: "FAIL",
        message: "Verification token is invalid or has expired.",
      };
    }

    const verified = true
    const isVerified = await userVerification.update(tokenPayload.id, {verified});

    return { isVerified }

  } catch (err) {
    return {
      response: 400,
      status: "FAIL",
      message: "An error has occured",
      error: err.message,
    };
  }
}

async function sendForgotPassword(req) {
  try {
    const email = req.body.email;

    if (email == null || undefined || "") {
      return {
        response: 403,
        status: "FAIL",
        message: "Email cannot empty",
      };
    }

    const user = await userVerification.findByEmail(email);

    if (user == null || undefined || "") {
      return {
        response: 403,
        status: "FAIL",
        message: "Email not registered",
      };
    }

    const token = userVerification.createTokenForgotPassword({
      email,
    });

    const forgot_password_token = token
    const verification = await userVerification.create({forgot_password_token})

    const mailOption = {
      from: "Champion API" + process.env.email,
      to: email,
      subject: "Reset Password",
      html: `<p>Hi ${email},</p>
      <p>Please click the following link to reset your password:</p>
      <p><a href="http://localhost:8000/forgot-password/${token}">http://localhost:8000/forgot-password/${token}</a></p>
      <p>The link will expire in one hour.</p>
      `,
    };

    await transporter.sendMail(mailOption);

    return { verification }

  } catch (err) {
    return {
      response: 400,
      status: "FAIL",
      message: "An error has occured",
      error: err.message,
    };
  }
}

async function verifyPassword(req) {
  try {
    const bearerToken = req.headers.authorization
    const token = bearerToken.split("Bearer ")[1]
    const tokenPayload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY)
    
    const forgot_password_token = req.params.forgot_password_token
    const isFound = await userVerification.findPasswordToken(forgot_password_token)

    if (!isFound) {
      return {
        response: 400,
        status: "FAIL",
        message: "Token do not match or not found ",
      };
    }

    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword

    if (newPassword == null || undefined || "") {
      return {
        response: 400,
        status: "FAIL",
        message: "New password field can not empty",
      };
    } else if (confirmPassword == null || undefined || "") {
      return {
        response: 400,
        status: "FAIL",
        message: "Confirm password field can not empty",
      };
    } else if (newPassword !== confirmPassword) {
      return {
        response: 400,
        status: "FAIL",
        message: "Password did not match",
      };
    }  

    const password = await encryptPassword(newPassword)

    const verify = await userVerification.updateByEmail(tokenPayload.email, {
      password,
    });

    return { verify }

  } catch (err) {
    return {
      response: 410,
      status: "FAIL",
      message: "An error has occured",
      error: err.message,
    };
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  sendForgotPassword,
  verifyPassword,
};
