const express = require("express");
const {
  register,
  login,
  resetpassword,
  forgotpassword,
  connectToMetamask,
} = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);

router.route("/login").post(login);

// router.route("/forgotpassword").post(forgotpassword);

// router.route("/resetpassword/:resetToken").put(resetpassword);

module.exports = router;
