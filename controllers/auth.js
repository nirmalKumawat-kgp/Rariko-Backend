require("dotenv").config({ path: "../config.env" });
const crypto = require("crypto");
const UserModel = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

const sendMail = require("../utils/sendMail");

// Register Controller
exports.register = async (req, res, next) => {
  const { address, password, domain } = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.create({ address, domain, password });
    console.log(user);
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// Login Controller

exports.login = async (req, res, next) => {
  const { address, password } = req.body;

  if (!address || !password) {
    return next(new ErrorResponse("Please provide Domain and password", 400));
  }

  try {
    const user = await UserModel.findOne({ address }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 404));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot Password Controller
// exports.forgotpassword = async (req, res, next) => {
//   const { address } = req.body;

//   try {
//     const user = await UserModel.findOne({ address });

//     if (!user) {
//       next(new ErrorResponse("Email could not be sent", 404));
//     }
//     const resetToken = user.getResetPasswordToken();

//     await user.save();
//     const resetUrl = `http://localhost:${process.env.F_PORT}/passwordReset/${resetToken}`;
//     const message = `
//     <h1>You have requested a password reset</h1>
//     <p> The reset link is below: </p>?
//     <a href=${resetUrl} clickTracking=off>${resetUrl}</a>
//     `;
//     try {
//       await sendMail({
//         to: user.email,
//         subject: "Password Reset Request",
//         text: message,
//       });

//       res.status(200).json({ success: true, data: "Email Sent" });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;

//       await user.save();

//       return next(new ErrorResponse("Email could not be sent"), 500);
//     }
//   } catch (error) {
//     next(error);
//   }
// };
// exports.resetpassword = async (req, res, next) => {
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.resetToken)
//     .digest("hex");

//   try {
//     const user = await UserModel.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return next(new ErrorResponse("Invalid Reset Token ", 400));
//     }
//     console.log(req.body.password);
//     user.password = req.body.password;

//     user.resetPasswordToken = undefined;

//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.status(201).json({
//       success: true,
//       data: "Password Reset Successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  return res.status(statusCode).json({
    success: true,
    token,
  });
};
