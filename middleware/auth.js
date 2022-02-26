require("dotenv").config({ path: "../config.env" });
const UserModel = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
      return next(new ErrorResponse("No User Found with this id", 404));
    }
    req.user = user;

    next();
  } catch (error) {
    next(new ErrorResponse("Not Authorized", 401));
  }
};
